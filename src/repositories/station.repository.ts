import { Station, IStation } from "../models/station.model";

export class StationRepository {
  async getAll(): Promise<IStation[]> {
    return Station.find();
  }

  async getById(id: string): Promise<IStation | null> {
    return Station.findById(id)
  }

  async create(data: Partial<IStation>): Promise<IStation> {
    const station = new Station(data);
    return station.save();
  }
}

export const stationRepository = new StationRepository();