import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findTeam(idOrSlug: string) {
  if (UUID_REGEX.test(idOrSlug)) {
    return prisma.team.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.team.findUnique({ where: { slug: idOrSlug } });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { slug: idOrSlug },
          ...(UUID_REGEX.test(idOrSlug) ? [{ id: idOrSlug }] : []),
        ],
      },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
            brand: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Equipe non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("GET /api/teams/[idOrSlug] error:", error);
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

    const existing = await findTeam(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Equipe non trouvee" },
        { status: 404 }
      );
    }

    const team = await prisma.team.update({
      where: { id: existing.id },
      data: body,
    });

    return NextResponse.json({ team });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("PUT /api/teams/[idOrSlug] error:", error);
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

    const existing = await findTeam(idOrSlug);
    if (!existing) {
      return NextResponse.json(
        { error: "Equipe non trouvee" },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: { teamId: existing.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: "Impossible de supprimer une equipe contenant des produits",
        },
        { status: 400 }
      );
    }

    await prisma.team.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: "Equipe supprimee" });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("DELETE /api/teams/[idOrSlug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
