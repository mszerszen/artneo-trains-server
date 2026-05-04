import { Request, Response } from "express";
import { connectionService } from "../services/connection.service";

export class ConnectionController {
  async getConnections(req: Request, res: Response) {
    try {
      const connections = await connectionService.getConnections();
      res.status(200).json(connections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getConnection(req: Request, res: Response) {
    try {
      const connection = await connectionService.getConnection(req.params.id as string);
      if (!connection) return res.status(404).json({ message: "Connection not found" });
      res.status(200).json(connection);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createConnection(req: Request, res: Response) {
    try {
      const connection = await connectionService.createConnection(req.body);
      res.status(201).json(connection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateConnection(req: Request, res: Response) {
    try {
      const connection = await connectionService.updateConnection(req.params.id as string, req.body);
      if (!connection) return res.status(404).json({ message: "Connection not found" });
      res.status(200).json(connection);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteConnection(req: Request, res: Response) {
    try {
      const connection = await connectionService.deleteConnection(req.params.id as string);
      if (!connection) return res.status(404).json({ message: "Connection not found" });
      res.status(200).json(connection);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const connectionController = new ConnectionController();