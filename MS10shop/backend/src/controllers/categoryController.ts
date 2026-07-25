import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        _count: { select: { products: true } },
      },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const createCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, nameAr, nameEn, description, image, parentId, sortOrder } = req.body;
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Date.now();

    const category = await prisma.category.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameEn: nameEn || null,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
      },
    });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      res.status(400).json({ error: "Cannot delete category with products" });
      return;
    }
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
