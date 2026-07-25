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
    const body = await request.json();

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Marque non trouvee" },
        { status: 404 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ brand });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("PUT /api/brands/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Marque non trouvee" },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: { brandId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: "Impossible de supprimer une marque contenant des produits",
        },
        { status: 400 }
      );
    }

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ message: "Marque supprimee" });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("DELETE /api/brands/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
