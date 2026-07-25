import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, nameAr, slug, description, image, parentId, sortOrder } =
      body;

    const category = await prisma.category.create({
      data: {
        name,
        nameAr,
        slug,
        description,
        image,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
