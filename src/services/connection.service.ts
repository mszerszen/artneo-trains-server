import { connectionRepository } from "../repositories/connection.repository";
import { IConnection } from "../models/connection.model";

interface CreateConnectionDTO {
  start: string;
  stops: { station: string; travelTime: number }[];
  end: { station: string; travelTime: number };
  price: number;
  departureTimes: string[];
}

export class ConnectionService {
  async getConnections(): Promise<IConnection[]> {
    return connectionRepository.getAll();
  }

  async getConnection(id: string): Promise<IConnection | null> {
    return connectionRepository.getById(id);
  }

  async createConnection(data: CreateConnectionDTO): Promise<IConnection> {
    if (!data.start || !data.end || !data.price || !data.departureTimes?.length) {
      throw new Error("Missing required fields");
    }

    return connectionRepository.create(data as any);
  }

  async updateConnection(id: string, data: Partial<CreateConnectionDTO>): Promise<IConnection | null> {
    return connectionRepository.update(id, data as any);
  }

  async deleteConnection(id: string): Promise<IConnection | null> {
    return connectionRepository.delete(id);
  }
}

export const connectionService = new ConnectionService();