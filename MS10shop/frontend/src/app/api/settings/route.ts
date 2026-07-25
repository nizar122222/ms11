import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const settingsRecords = await prisma.siteSettings.findMany();

    const settings: Record<string, any> = {};
    for (const record of settingsRecords) {
      if (record.type === "boolean") {
        settings[record.key] = record.value === "true";
      } else if (record.type === "number") {
        settings[record.key] = parseFloat(record.value);
      } else {
        settings[record.key] = record.value;
      }
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Parametres invalides" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      let type = "string";
      let stringValue = String(value);

      if (typeof value === "boolean") {
        type = "boolean";
        stringValue = value ? "true" : "false";
      } else if (typeof value === "number") {
        type = "number";
        stringValue = String(value);
      }

      await prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: stringValue, type },
        update: { value: stringValue, type },
      });
    }

    return NextResponse.json({ message: "Parametres mis a jour" });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Non autorise" }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
