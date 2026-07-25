import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const wishlistWithRating = wishlist.map((w) => {
      const ratings = w.product.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        ...w,
        product: {
          ...w.product,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: ratings.length,
        },
      };
    });

    return NextResponse.json({ wishlist: wishlistWithRating });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
