import { Request, Response } from "express";
import { scheduleService } from "../services/schedule.service";

export class ScheduleController {
  async getSchedule(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.getSchedule(req.params.id as string);
      res.status(200).json(schedule);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const scheduleController = new ScheduleController();