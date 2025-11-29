import { Router } from "express";
import {
  getPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from "../controllers/people";

const router = Router();

router.get("/", getPeople);
router.get("/:id", getPersonById);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
