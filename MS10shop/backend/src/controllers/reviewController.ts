import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.query;
    const where: any = { isApproved: true };
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      res.status(409).json({ error: "You have already reviewed this product" });
      return;
    }

    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: req.user.id, status: "DELIVERED" },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating: parseInt(rating),
        title: title || null,
        comment: comment || null,
        isVerified: !!hasPurchased,
        isApproved: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const approveReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve review" });
  }
};

export const deleteReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};
