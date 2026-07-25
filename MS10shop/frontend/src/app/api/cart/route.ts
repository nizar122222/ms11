import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function getCart(userId: string) {
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" } }, sizes: true },
          },
        },
      },
    },
  });

  const total = cart.items.reduce((sum, item) => {
    const price = item.product.isOnSale && item.product.salePrice
      ? item.product.salePrice
      : item.product.price;
    return sum + (price + item.customizationPrice) * item.quantity;
  }, 0);

  return { cart, total };
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const result = await getCart(user.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
