import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { CustomAPIError } from "../errors/custom-error";

const prisma = new PrismaClient();

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        pet: true,
        vet: { include: { person: true } },
      },
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        pet: true,
        vet: { include: { person: true } },
      },
    });

    if (!appointment) {
      throw new CustomAPIError("Appointment not found.", 404);
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const newAppointment = await prisma.appointment.create({
      data,
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomAPIError("Appointment not found.", 404);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomAPIError("Appointment not found.", 404);
    }

    await prisma.appointment.delete({
      where: { id },
    });

    res.json({ msg: "Appointment deleted successfully." });
  } catch (err) {
    next(err);
  }
};
