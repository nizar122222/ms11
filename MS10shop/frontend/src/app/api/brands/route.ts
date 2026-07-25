import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("GET /api/brands error:", error);
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
    const { name, logo, description } = body;

    const slug = `${name}-${Date.now()}`;

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo,
        description,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("POST /api/brands error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
