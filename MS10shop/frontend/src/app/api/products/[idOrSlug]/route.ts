import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findProduct(idOrSlug: string) {
  if (UUID_REGEX.test(idOrSlug)) {
    return prisma.product.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.product.findUnique({ where: { slug: idOrSlug } });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: idOrSlug },
          ...(UUID_REGEX.test(idOrSlug) ? [{ id: idOrSlug }] : []),
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        sizes: { where: { isActive: true } },
        category: true,
        brand: true,
        team: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
          { teamId: product.teamId },
        ],
      },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        brand: true,
        team: true,
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("GET /api/products/[idOrSlug] error:", error);
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
    const { images, sizes, ...data } = body;

    const existing = await findProduct(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);

    let updateData: any = { ...data };

    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: existing.id },
      });
      updateData.images = {
        create: images.map((img: any, index: number) => ({
          url: img.url,
          alt: img.alt || data.name || existing.name,
          sortOrder: index,
        })),
      };
    }

    if (sizes) {
      await prisma.productSize.deleteMany({
        where: { productId: existing.id },
      });
      updateData.sizes = {
        create: sizes.map((s: any) => ({
          size: s.size,
          stock: parseInt(s.stock),
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        sizes: true,
        category: true,
        brand: true,
        team: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("PUT /api/products/[idOrSlug] error:", error);
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

    const existing = await findProduct(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: "Produit supprime" });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("DELETE /api/products/[idOrSlug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
