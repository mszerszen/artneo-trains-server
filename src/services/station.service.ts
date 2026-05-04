import { IStation } from "../models/station.model";
import { stationRepository } from "../repositories/station.repository";

export class StationService {
  async getStations(): Promise<IStation[]> {
    return stationRepository.getAll();
  }

  async createStation(data: { name: string; city: string; type: "main" | "secondary" }): Promise<IStation> {
    if (!data.name || !data.city || !data.type) {
      throw new Error("Missing required fields");
    }

    return stationRepository.create(data);
  }
}

export const stationService = new StationService();