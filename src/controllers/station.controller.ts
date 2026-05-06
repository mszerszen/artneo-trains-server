import { Request, Response } from "express";
import { stationService } from "../services/station.service";

export class StationController {
  async getStations(req: Request, res: Response) {
    try {
      const stations = await stationService.getStations();
      res.status(200).json(stations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getStation(req: Request, res: Response) {
    try {
      const station = await stationService.getStation(req.params.id as string);
      res.status(200).json(station);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createStation(req: Request, res: Response) {
    try {
      const station = await stationService.createStation(req.body);
      res.status(201).json(station);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const stationController = new StationController();