import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

export const createBrand = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, logo, description, website } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const brand = await prisma.brand.create({
      data: { name, slug, logo: logo || null, description: description || null, website: website || null },
    });
    res.status(201).json({ brand });
  } catch (error) {
    res.status(500).json({ error: "Failed to create brand" });
  }
};

export const updateBrand = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await prisma.brand.update({ where: { id }, data: req.body });
    res.json({ brand });
  } catch (error) {
    res.status(500).json({ error: "Failed to update brand" });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const count = await prisma.product.count({ where: { brandId: id } });
    if (count > 0) {
      res.status(400).json({ error: "Cannot delete brand with products" });
      return;
    }
    await prisma.brand.delete({ where: { id } });
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
};
