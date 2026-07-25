import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth();

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    const user = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
