import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import stationRoutes from "./routes/station.routes";
import connectionRoutes from "./routes/connection.routes";
import scheduleRoutes from "./routes/schedule.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

connectDB();

app.use("/connections", connectionRoutes);
app.use("/stations", stationRoutes);
app.use("/schedules", scheduleRoutes)

app.listen(ENV.PORT, () => {
  console.log(`Backend running on http://localhost:${ENV.PORT}`);
});