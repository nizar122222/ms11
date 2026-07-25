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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId, size, quantity = 1, customName, customNumber, customizationPrice = 0 } = body;

    if (!productId || !size) {
      return NextResponse.json({ error: "productId et size requis" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { sizes: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit non trouve" }, { status: 404 });
    }

    const productSize = product.sizes.find((s) => s.size === size);
    if (!productSize || productSize.stock < quantity) {
      return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
    }

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId_size: { cartId: cart.id, productId, size } },
    });

    if (existingItem) {
      if (productSize.stock < existingItem.quantity + quantity) {
        return NextResponse.json({ error: "Stock insuffisant" }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          size,
          quantity,
          customName: customName || null,
          customNumber: customNumber || null,
          customizationPrice: customizationPrice || 0,
        },
      });
    }

    const result = await getCart(user.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("POST /api/cart/add error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
