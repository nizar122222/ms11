import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, league, search, page = "1", limit = "50" } = req.query;
    const where: any = { isActive: true };

    if (type) where.type = type;
    if (league) where.league = league as string;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { nameEn: { contains: search as string, mode: "insensitive" } },
        { country: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.team.count({ where }),
    ]);

    res.json({
      teams,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const team = await prisma.team.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
};

export const createTeam = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, nameAr, nameEn, logo, country, countryAr, league, leagueAr, type } = req.body;
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Date.now();

    const team = await prisma.team.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameEn: nameEn || null,
        slug,
        logo: logo || null,
        country: country || null,
        countryAr: countryAr || null,
        league: league || null,
        leagueAr: leagueAr || null,
        type: type || "CLUB",
      },
    });
    res.status(201).json({ team });
  } catch (error) {
    res.status(500).json({ error: "Failed to create team" });
  }
};

export const updateTeam = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const team = await prisma.team.update({ where: { id }, data: req.body });
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: "Failed to update team" });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productCount = await prisma.product.count({ where: { teamId: id } });
    if (productCount > 0) {
      res.status(400).json({ error: "Cannot delete team with products" });
      return;
    }
    await prisma.team.delete({ where: { id } });
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team" });
  }
};
