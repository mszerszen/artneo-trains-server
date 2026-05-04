import { Router } from "express";
import { connectionController } from "../controllers/connection.controller";

const router = Router();

router.get("/", (req, res) => connectionController.getConnections(req, res));
router.get("/:id", (req, res) => connectionController.getConnection(req, res));
router.post("/", (req, res) => connectionController.createConnection(req, res));
router.put("/:id", (req, res) => connectionController.updateConnection(req, res));
router.delete("/:id", (req, res) => connectionController.deleteConnection(req, res));

export default router;