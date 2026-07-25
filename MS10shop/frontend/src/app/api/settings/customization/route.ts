import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [enabledRecord, priceRecord, labelRecord] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: "customization_enabled" } }),
      prisma.siteSettings.findUnique({ where: { key: "customization_price" } }),
      prisma.siteSettings.findUnique({ where: { key: "customization_label" } }),
    ]);

    return NextResponse.json({
      enabled: enabledRecord ? enabledRecord.value === "true" : true,
      price: priceRecord ? parseFloat(priceRecord.value) : 50,
      label: labelRecord ? labelRecord.value : "Impression nom & numero",
    });
  } catch (error) {
    console.error("GET /api/settings/customization error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
