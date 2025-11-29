import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { CustomAPIError } from "../errors/custom-error";

const prisma = new PrismaClient();

export const getVets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vets = await prisma.vet.findMany({
      include: {
        person: true,
        appointments: true,
      },
    });

    res.json(vets);
  } catch (err) {
    next(err);
  }
};

export const getVetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vetId = Number(req.params.id);

    const vet = await prisma.vet.findUnique({
      where: { id: vetId },
      include: {
        person: true,
        appointments: true,
      },
    });

    if (!vet) {
      throw new CustomAPIError("Vet not found.", 404);
    }

    res.json(vet);
  } catch (err) {
    next(err);
  }
};

export const createVet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, crmv, specialty } = req.body;

    const person = await prisma.person.findUnique({ where: { id } });

    if (!person) {
      throw new CustomAPIError("Cannot create Vet: Person not found.", 404);
    }

    const newVet = await prisma.vet.create({
      data: {
        id,
        crmv,
        specialty,
      },
    });

    res.status(201).json(newVet);
  } catch (err) {
    next(err);
  }
};

export const updateVet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vetId = Number(req.params.id);
    const data = req.body;

    const vet = await prisma.vet.findUnique({ where: { id: vetId } });

    if (!vet) {
      throw new CustomAPIError("Vet not found.", 404);
    }

    const updatedVet = await prisma.vet.update({
      where: { id: vetId },
      data,
    });

    res.json(updatedVet);
  } catch (err) {
    next(err);
  }
};

export const deleteVet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vetId = Number(req.params.id);

    const vet = await prisma.vet.findUnique({ where: { id: vetId } });

    if (!vet) {
      throw new CustomAPIError("Vet not found.", 404);
    }

    await prisma.vet.delete({
      where: { id: vetId },
    });

    res.json({ msg: "Vet deleted successfully." });
  } catch (err) {
    next(err);
  }
};
