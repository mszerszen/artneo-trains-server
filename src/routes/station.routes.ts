import { Router } from "express";
import { stationController } from "../controllers/station.controller";

const router = Router();

router.get("/", (req, res) => stationController.getStations(req, res));
router.get("/:id", (req, res) => stationController.getStation(req, res));
router.post("/", (req, res) => stationController.createStation(req, res));

export default router;