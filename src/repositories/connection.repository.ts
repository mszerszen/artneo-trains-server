import { Connection, IConnection } from "../models/connection.model";

export class ConnectionRepository {
  async getAll(): Promise<IConnection[]> {
    return Connection.find()
      .populate("start")
      .populate("stops.station");
  }

  async getById(id: string): Promise<IConnection | null> {
    return Connection.findById(id)
      .populate("start")
      .populate("stops.station");
  }

  async create(data: Partial<IConnection>): Promise<IConnection> {
    const connection = new Connection(data);
    return connection.save();
  }

  async update(id: string, data: Partial<IConnection>): Promise<IConnection | null> {
    return Connection.findByIdAndUpdate(id, data, { new: true })
      .populate("start")
      .populate("stops.station");
  }

  async delete(id: string): Promise<IConnection | null> {
    return Connection.findByIdAndDelete(id);
  }
}

export const connectionRepository = new ConnectionRepository();