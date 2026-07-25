import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId requis" }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ isWishlisted: false });
    }

    await prisma.wishlist.create({
      data: { userId: user.id, productId },
    });

    return NextResponse.json({ isWishlisted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("POST /api/wishlist/toggle error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
