import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { CustomAPIError } from "../errors/custom-error";

const prisma = new PrismaClient();

export const getPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        person: true,
        appointments: true,
      },
    });

    res.json(pets);
  } catch (err) {
    next(err);
  }
};

export const getPetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petId = Number(req.params.id);

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        person: true,
        appointments: true,
      },
    });

    if (!pet) {
      throw new CustomAPIError("Pet not found.", 404);
    }

    res.json(pet);
  } catch (err) {
    next(err);
  }
};

export const createPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const person = await prisma.person.findUnique({
      where: { id: data.personId },
    });

    if (!person) {
      throw new CustomAPIError("Cannot create Pet: Person not found.", 404);
    }

    const newPet = await prisma.pet.create({
      data,
    });

    res.status(201).json(newPet);
  } catch (err) {
    next(err);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petId = Number(req.params.id);
    const data = req.body;

    const pet = await prisma.pet.findUnique({ where: { id: petId } });

    if (!pet) {
      throw new CustomAPIError("Pet not found.", 404);
    }

    if (data.personId) {
      const tutor = await prisma.person.findUnique({
        where: { id: data.personId },
      });

      if (!tutor) {
        throw new CustomAPIError("New tutor (Person) not found.", 404);
      }
    }

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data,
    });

    res.json(updatedPet);
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petId = Number(req.params.id);

    const pet = await prisma.pet.findUnique({ where: { id: petId } });

    if (!pet) {
      throw new CustomAPIError("Pet not found.", 404);
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    res.json({ msg: "Pet deleted successfully." });
  } catch (err) {
    next(err);
  }
};
