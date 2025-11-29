import "dotenv/config";
import express from "express";
import cors from "cors";

import appointmentsRouter from "./routes/appointments";
import peopleRouter from "./routes/people";
import petsRouter from "./routes/pets";
import vetsRouter from "./routes/vets";

import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

app.use(express.json());

app.use("/appointments", appointmentsRouter);

app.use("/people", peopleRouter);
app.use("/vets", vetsRouter);

app.use("/pets", petsRouter);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

export default app;
