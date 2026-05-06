import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller";
import { scheduleService } from "../services/schedule.service";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const pdfBuffer = await scheduleService.getSchedule(req.params.id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="rozklad.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd generowania PDF" });
  }
});

export default router;