import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Client non trouve" }, { status: 404 });
    }

    const recentOrders = await prisma.order.findMany({
      where: { userId: id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({ customer: { ...customer, recentOrders } });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("GET /api/customers/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
