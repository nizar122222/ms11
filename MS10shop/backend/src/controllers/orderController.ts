import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MS10-${year}${month}-${random}`;
};

export const createOrder = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      postalCode,
      country,
      notes,
      paymentMethod,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item" });
      return;
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { sizes: true, images: { where: { isPrimary: true } } },
      });

      if (!product) {
        res.status(404).json({ error: `Product not found: ${item.productId}` });
        return;
      }

      const sizeInfo = product.sizes.find(
        (s) => s.size === item.size && s.isActive
      );
      if (!sizeInfo || sizeInfo.stock < item.quantity) {
        res.status(400).json({
          error: `Insufficient stock for ${product.name} (size: ${item.size})`,
        });
        return;
      }

      const price = product.isOnSale && product.salePrice ? product.salePrice : product.price;
      const itemCustomizationPrice = item.customizationPrice || 0;
      const itemTotal = (price + itemCustomizationPrice) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0]?.url || null,
        size: item.size,
        quantity: item.quantity,
        price: price + itemCustomizationPrice,
        total: itemTotal,
        customName: item.customName || null,
        customNumber: item.customNumber || null,
        customizationPrice: itemCustomizationPrice,
      });
    }

    const shippingCost = subtotal >= 500 ? 0 : 30;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        postalCode,
        country,
        notes: notes || null,
        paymentMethod: paymentMethod || "CASH_ON_DELIVERY",
        subtotal,
        shippingCost,
        tax,
        total,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await prisma.productSize.updateMany({
        where: { productId: item.productId, size: item.size },
        data: { stock: { decrement: item.quantity } },
      });

      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          soldCount: { increment: item.quantity },
        },
      });
    }

    await prisma.cart.deleteMany({ where: { userId: req.user.id } });

    res.status(201).json({ order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrders = async (req: any, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    if (req.user.role !== "ADMIN") {
      where.userId = req.user.id;
    }
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrder = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateOrderStatus = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid order status" });
      return;
    }

    const updateData: any = { status };

    if (status === "SHIPPING") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    if (status === "CANCELLED") {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (order && order.status !== "CANCELLED") {
        for (const item of order.items) {
          await prisma.productSize.updateMany({
            where: { productId: item.productId, size: item.size },
            data: { stock: { increment: item.quantity } },
          });
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              soldCount: { decrement: item.quantity },
            },
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    res.json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const getOrderStats = async (req: any, res: Response): Promise<void> => {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    const totalProducts = await prisma.product.count();

    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
