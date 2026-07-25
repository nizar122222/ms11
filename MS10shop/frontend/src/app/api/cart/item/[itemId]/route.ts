import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
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

  const total = cart
    ? cart.items.reduce((sum, item) => {
        const price = item.product.isOnSale && item.product.salePrice
          ? item.product.salePrice
          : item.product.price;
        return sum + (price + item.customizationPrice) * item.quantity;
      }, 0)
    : 0;

  return { cart, total };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth();
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: { include: { sizes: true } } },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const productSize = cartItem.product.sizes.find((s) => s.size === cartItem.size);
      if (!productSize || productSize.stock < quantity) {
        return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
      }
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }

    const result = await getCart(user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("PUT /api/cart/item/[itemId] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireAuth();
    const { itemId } = await params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Article non trouve" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const result = await getCart(user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("DELETE /api/cart/item/[itemId] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
