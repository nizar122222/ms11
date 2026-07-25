import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findCategory(idOrSlug: string) {
  if (UUID_REGEX.test(idOrSlug)) {
    return prisma.category.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.category.findUnique({ where: { slug: idOrSlug } });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: idOrSlug },
          ...(UUID_REGEX.test(idOrSlug) ? [{ id: idOrSlug }] : []),
        ],
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("GET /api/categories/[idOrSlug] error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    await requireAdmin();

    const { idOrSlug } = await params;
    const body = await request.json();

    const existing = await findCategory(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: body,
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("PUT /api/categories/[idOrSlug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    await requireAdmin();

    const { idOrSlug } = await params;

    const existing = await findCategory(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Categorie non trouvee" },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: { categoryId: existing.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: "Impossible de supprimer une categorie contenant des produits",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: "Categorie supprimee" });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("DELETE /api/categories/[idOrSlug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
