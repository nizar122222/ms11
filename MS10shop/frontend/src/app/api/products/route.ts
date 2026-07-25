import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const team = searchParams.get("team");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const isNew = searchParams.get("isNew");
    const isSale = searchParams.get("isSale");
    const isFeatured = searchParams.get("isFeatured");
    const isBestSeller = searchParams.get("isBestSeller");

    const where: any = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (team) {
      where.team = { slug: team };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (size) {
      where.sizes = {
        some: { size, stock: { gt: 0 } },
      };
    }

    if (isNew === "true") where.isNewArrival = true;
    if (isSale === "true") where.isSale = true;
    if (isFeatured === "true") where.isFeatured = true;
    if (isBestSeller === "true") where.isBestSeller = true;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          sizes: { where: { isActive: true } },
          category: true,
          brand: true,
          team: true,
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });

    return NextResponse.json({
      products: productsWithRating,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      nameAr,
      nameEn,
      description,
      price,
      categoryId,
      brandId,
      teamId,
      stock,
      tags,
      isFeatured,
      isNewArrival,
      isBestSeller,
      images,
      sizes,
    } = body;

    const slug = `${name}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        nameAr,
        nameEn,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        brandId,
        teamId,
        stock: stock ? parseInt(stock) : 0,
        tags,
        isFeatured: isFeatured || false,
        isNewArrival: isNewArrival || false,
        isBestSeller: isBestSeller || false,
        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || name,
                sortOrder: index,
              })),
            }
          : undefined,
        sizes: sizes
          ? {
              create: sizes.map((s: any) => ({
                size: s.size,
                stock: parseInt(s.stock),
              })),
            }
          : undefined,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        sizes: true,
        category: true,
        brand: true,
        team: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
