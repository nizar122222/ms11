import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const toggleWishlist = async (req: any, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      res.json({ isWishlisted: false });
    } else {
      await prisma.wishlist.create({
        data: { userId: req.user.id, productId },
      });
      res.json({ isWishlisted: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle wishlist" });
  }
};

export const getWishlist = async (req: any, res: Response): Promise<void> => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlist.map((w) => {
      const avgRating =
        w.product.reviews.length > 0
          ? w.product.reviews.reduce((s, r) => s + r.rating, 0) /
            w.product.reviews.length
          : 0;
      return {
        ...w,
        product: {
          ...w.product,
          avgRating,
          reviewCount: w.product.reviews.length,
        },
      };
    });

    res.json({ wishlist: items });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};
