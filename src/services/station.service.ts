import { IStation } from "../models/station.model";
import { stationRepository } from "../repositories/station.repository";

export class StationService {
  async getStations(): Promise<IStation[]> {
    return stationRepository.getAll();
  }

  async getStation(id: string): Promise<IStation | null> {
    return stationRepository.getById(id);
  }

  async createStation(data: { name: string, lat: string, lng: string }): Promise<IStation> {
    if (!data.name || !data.lat || !data.lng) {
      throw new Error("Missing required fields");
    }

    return stationRepository.create(data);
  }
}

export const stationService = new StationService();