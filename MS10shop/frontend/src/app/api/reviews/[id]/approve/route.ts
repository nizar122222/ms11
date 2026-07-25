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

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Avis non trouve" }, { status: 404 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("PUT /api/reviews/[id]/approve error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
