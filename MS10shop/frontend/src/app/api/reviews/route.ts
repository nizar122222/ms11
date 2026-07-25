import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const where: any = { isApproved: true };
    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: "productId et rating requis" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating doit etre entre 1 et 5" }, { status: 400 });
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Vous avez deja laisse un avis pour ce produit" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating: parseInt(rating),
        title: title || null,
        comment: comment || null,
        isApproved: true,
        isVerified: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
