import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!customer) {
      return NextResponse.json({ error: "Client non trouve" }, { status: 404 });
    }

    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: { isActive: !customer.isActive },
      select: { id: true, isActive: true },
    });

    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("PUT /api/customers/[id]/toggle-status error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
