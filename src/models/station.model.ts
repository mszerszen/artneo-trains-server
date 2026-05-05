import mongoose, { Schema, Document } from "mongoose";

export interface IStation extends Document {
  name: string;
  lat: string;
  lng: string;
}

const StationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true }
  }
);

export const Station = mongoose.model<IStation>("Station", StationSchema);