import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { CustomAPIError } from "../errors/custom-error";

const prisma = new PrismaClient();

export const getPeople = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const people = await prisma.person.findMany({
      include: {
        pets: true,
        vet: true,
      },
    });

    res.json(people);
  } catch (err) {
    next(err);
  }
};

export const getPersonById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const personId = Number(req.params.id);

    const person = await prisma.person.findUnique({
      where: { id: personId },
      include: {
        pets: true,
        vet: true,
      },
    });

    if (!person) {
      throw new CustomAPIError("Person not found.", 404);
    }

    res.json(person);
  } catch (err) {
    next(err);
  }
};

export const createPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const newPerson = await prisma.person.create({
      data,
    });

    res.status(201).json(newPerson);
  } catch (err) {
    next(err);
  }
};

export const updatePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const personId = Number(req.params.id);
    const data = req.body;

    const person = await prisma.person.findUnique({ where: { id: personId } });

    if (!person) {
      throw new CustomAPIError("Person not found.", 404);
    }

    const updatedPerson = await prisma.person.update({
      where: { id: personId },
      data,
    });

    res.json(updatedPerson);
  } catch (err) {
    next(err);
  }
};

export const deletePerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const personId = Number(req.params.id);

    const person = await prisma.person.findUnique({ where: { id: personId } });

    if (!person) {
      throw new CustomAPIError("Person not found.", 404);
    }

    await prisma.person.delete({
      where: { id: personId },
    });

    res.json({ msg: "Person deleted successfully." });
  } catch (err) {
    next(err);
  }
};
