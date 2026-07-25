import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { firstName, lastName, phone, email, address, city, postalCode, country, notes, paymentMethod, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Aucun article" }, { status: 400 });
    }

    if (!firstName || !lastName || !phone || !email || !address || !city || !postalCode || !country) {
      return NextResponse.json({ error: "Informations de livraison incompletes" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { sizes: true, images: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Produit ${item.productId} non trouve` }, { status: 404 });
      }

      const productSize = product.sizes.find((s) => s.size === item.size);
      if (!productSize || productSize.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuffisant pour ${product.name} (${item.size})` }, { status: 400 });
      }

      const unitPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
      const customizationPrice = item.customizationPrice || 0;
      const itemTotal = (unitPrice + customizationPrice) * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0]?.url || null,
        size: item.size,
        quantity: item.quantity,
        price: unitPrice + customizationPrice,
        total: itemTotal,
        customName: item.customName || null,
        customNumber: item.customNumber || null,
        customizationPrice,
      });
    }

    const shippingCost = subtotal >= 500 ? 0 : 30;
    const total = subtotal + shippingCost;

    const now = new Date();
    const year = now.getFullYear() % 100;
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(1000 + Math.random() * 9000));
    const orderNumber = `MS10-${String(year).padStart(2, "0")}${month}-${random}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          postalCode,
          country,
          notes: notes || null,
          paymentMethod: paymentMethod || "CASH_ON_DELIVERY",
          subtotal,
          shippingCost,
          total,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.productSize.update({
          where: { productId_size: { productId: item.productId, size: item.size } },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity }, soldCount: { increment: item.quantity } },
        });
      }

      const cart = await tx.cart.findUnique({ where: { userId: user.id } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user.role !== "ADMIN") {
      where.userId = user.id;
    }
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { include: { images: { take: 1 } } } } },
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
