import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const [totalOrders, statusCounts, revenueResult, totalCustomers, totalProducts, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.groupBy({ by: ["status"], _count: true }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: true,
        },
      }),
    ]);

    const statusMap: Record<string, number> = {};
    for (const sc of statusCounts) {
      statusMap[sc.status] = sc._count;
    }

    const stats = {
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      totalCustomers,
      totalProducts,
      pendingOrders: statusMap["PENDING"] || 0,
      confirmedOrders: statusMap["CONFIRMED"] || 0,
      preparingOrders: statusMap["PREPARING"] || 0,
      shippingOrders: statusMap["SHIPPING"] || 0,
      deliveredOrders: statusMap["DELIVERED"] || 0,
      cancelledOrders: statusMap["CANCELLED"] || 0,
    };

    return NextResponse.json({ stats, recentOrders });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("GET /api/orders/stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
