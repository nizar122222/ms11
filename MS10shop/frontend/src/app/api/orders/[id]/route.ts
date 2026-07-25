import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const where: any = { id };
    if (user.role !== "ADMIN") {
      where.userId = user.id;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: { include: { product: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvee" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
