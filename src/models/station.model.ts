import mongoose, { Schema, Document } from "mongoose";

export interface IStation extends Document {
  name: string;
}

const StationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true }
  }
);

export const Station = mongoose.model<IStation>("Station", StationSchema);