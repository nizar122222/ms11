import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) {
      return NextResponse.json({ error: "Commande non trouvee" }, { status: 404 });
    }

    const updateData: any = { status };

    if (status === "SHIPPING") {
      updateData.shippedAt = new Date();
    }

    if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    if (status === "CANCELLED") {
      for (const item of order.items) {
        await prisma.productSize.update({
          where: { productId_size: { productId: item.productId, size: item.size } },
          data: { stock: { increment: item.quantity } },
        });
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity }, soldCount: { decrement: item.quantity } },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("PUT /api/orders/[id]/status error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
