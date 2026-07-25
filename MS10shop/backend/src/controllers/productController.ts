import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "24",
      category,
      brand,
      team,
      search,
      minPrice,
      maxPrice,
      size,
      sort = "createdAt",
      order = "desc",
      isNew,
      isSale,
      isFeatured,
      isBestSeller,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (team) where.team = { slug: team };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { nameEn: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { tags: { has: search as string } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (size) {
      where.sizes = { some: { size: size as string, stock: { gt: 0 } } };
    }
    if (isNew === "true") where.isNewArrival = true;
    if (isSale === "true") where.isOnSale = true;
    if (isFeatured === "true") where.isFeatured = true;
    if (isBestSeller === "true") where.isBestSeller = true;

    const orderBy: any = {};
    if (sort === "price") orderBy.price = order;
    else if (sort === "name") orderBy.name = order;
    else if (sort === "popular") orderBy.soldCount = order;
    else if (sort === "rating") orderBy.reviews = { _count: order };
    else orderBy.createdAt = order;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          sizes: { where: { isActive: true } },
          category: true,
          brand: true,
          team: true,
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithMeta = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;
      const { reviews, ...rest } = product;
      return { ...rest, avgRating, reviewCount: reviews.length };
    });

    res.json({
      products: productsWithMeta,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        sizes: { where: { isActive: true } },
        category: true,
        brand: true,
        team: true,
        reviews: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { teamId: product.teamId },
          { brandId: product.brandId },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        reviews: { select: { rating: true } },
      },
      take: 8,
    });

    const related = relatedProducts.map((p) => {
      const avg =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, avgRating: avg, reviewCount: reviews.length };
    });

    res.json({
      product: { ...product, avgRating, reviewCount: product.reviews.length },
      relatedProducts: related,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      name,
      nameAr,
      nameEn,
      description,
      descriptionAr,
      descriptionEn,
      price,
      comparePrice,
      costPrice,
      sku,
      categoryId,
      brandId,
      teamId,
      stock,
      tags,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isOnSale,
      salePrice,
      metaTitle,
      metaDesc,
      images,
      sizes,
    } = req.body;

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameEn: nameEn || null,
        slug,
        description,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku: sku || null,
        categoryId,
        brandId: brandId || null,
        teamId: teamId || null,
        stock: parseInt(stock) || 0,
        tags: tags || [],
        isFeatured: isFeatured === true || isFeatured === "true",
        isNewArrival: isNewArrival === true || isNewArrival === "true",
        isBestSeller: isBestSeller === true || isBestSeller === "true",
        isOnSale: isOnSale === true || isOnSale === "true",
        salePrice: salePrice ? parseFloat(salePrice) : null,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        images: images?.length
          ? {
              create: images.map((img: any, i: number) => ({
                url: img.url,
                alt: img.alt || name,
                sortOrder: i,
                isPrimary: i === 0,
              })),
            }
          : undefined,
        sizes: sizes?.length
          ? {
              create: sizes.map((s: any) => ({
                size: s.size,
                stock: parseInt(s.stock) || 0,
              })),
            }
          : undefined,
      },
      include: { images: true, sizes: true, category: true },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.price) data.price = parseFloat(data.price);
    if (data.comparePrice) data.comparePrice = parseFloat(data.comparePrice);
    if (data.salePrice) data.salePrice = parseFloat(data.salePrice);
    if (data.stock) data.stock = parseInt(data.stock);

    if (data.images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      data.images = {
        create: data.images.map((img: any, i: number) => ({
          url: img.url,
          alt: img.alt || "",
          sortOrder: i,
          isPrimary: i === 0,
        })),
      };
    }

    if (data.sizes) {
      await prisma.productSize.deleteMany({ where: { productId: id } });
      data.sizes = {
        create: data.sizes.map((s: any) => ({
          size: s.size,
          stock: parseInt(s.stock) || 0,
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { images: true, sizes: true, category: true, brand: true, team: true },
    });

    res.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
