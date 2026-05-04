import mongoose, { Schema, Document } from "mongoose";

export interface IStation extends Document {
  name: string;
  city: string;
  type: "main" | "secondary";
}

const StationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, required: true }
  }
);

export const Station = mongoose.model<IStation>("Station", StationSchema);