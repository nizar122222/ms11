import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCustomers = async (req: any, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { role: "CUSTOMER" };
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      customers,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomer = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { items: true },
        },
        _count: { select: { orders: true } },
      },
    });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({ customer });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const toggleCustomerStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({ where: { id } });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !customer.isActive },
      select: { id: true, isActive: true },
    });
    res.json({ customer: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer status" });
  }
};

export const getCustomerStats = async (req: any, res: Response): Promise<void> => {
  try {
    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    const activeCustomers = await prisma.user.count({
      where: { role: "CUSTOMER", isActive: true },
    });
    const newThisMonth = await prisma.user.count({
      where: {
        role: "CUSTOMER",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    res.json({ totalCustomers, activeCustomers, newThisMonth });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer stats" });
  }
};
