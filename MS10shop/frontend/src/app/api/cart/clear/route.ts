import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();

    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ message: "Panier vide" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    console.error("DELETE /api/cart/clear error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
