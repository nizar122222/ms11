import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: Record<string, { value: string; type: string }> = {
  customization_enabled: { value: "true", type: "boolean" },
  customization_price: { value: "50", type: "number" },
  customization_label: { value: "Impression nom & numéro", type: "string" },
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findMany();
    if (settings.length === 0) {
      for (const [key, { value, type }] of Object.entries(DEFAULT_SETTINGS)) {
        await prisma.siteSettings.create({ data: { key, value, type } });
      }
      settings = await prisma.siteSettings.findMany();
    }
    const result: Record<string, any> = {};
    for (const s of settings) {
      if (s.type === "boolean") result[s.key] = s.value === "true";
      else if (s.type === "number") result[s.key] = parseFloat(s.value);
      else result[s.key] = s.value;
    }
    res.json({ settings: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: any, res: Response): Promise<void> => {
  try {
    if (req.user.role !== "ADMIN") {
      res.status(403).json({ error: "Access denied" });
      return;
    }
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings) as [string, any][]) {
      const existing = await prisma.siteSettings.findUnique({ where: { key } });
      const type = typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string";
      const strValue = String(value);
      if (existing) {
        await prisma.siteSettings.update({ where: { key }, data: { value: strValue, type } });
      } else {
        await prisma.siteSettings.create({ data: { key, value: strValue, type } });
      }
    }
    res.json({ message: "Settings updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const getCustomizationSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findMany();
    if (settings.length === 0) {
      for (const [key, { value, type }] of Object.entries(DEFAULT_SETTINGS)) {
        await prisma.siteSettings.create({ data: { key, value, type } });
      }
      settings = await prisma.siteSettings.findMany();
    }
    const enabled = settings.find(s => s.key === "customization_enabled")?.value !== "false";
    const price = parseFloat(settings.find(s => s.key === "customization_price")?.value || "50");
    const label = settings.find(s => s.key === "customization_label")?.value || "Impression nom & numéro";
    res.json({ enabled, price, label });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customization settings" });
  }
};
