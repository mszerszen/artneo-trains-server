import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConnectionStop {
  station: Types.ObjectId;
  travelTime: number;
}

export interface IConnectionEnd {
  station: Types.ObjectId;
  travelTime: number;
}

export interface IConnection extends Document {
  start: Types.ObjectId;
  stops: IConnectionStop[];
  end: IConnectionEnd;
  price: number;
  departureTimes: string[];
}

const ConnectionStopSchema = new Schema<IConnectionStop>(
  {
    station: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    travelTime: { type: Number, required: true }
  },
  { _id: false }
);

const ConnectionEndSchema = new Schema<IConnectionEnd>(
  {
    station: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    travelTime: { type: Number, required: true }
  },
  { _id: false }
);

const ConnectionSchema = new Schema<IConnection>(
  {
    start: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    stops: { type: [ConnectionStopSchema], default: [] },
    end: { type: ConnectionEndSchema, required: true },
    price: { type: Number, required: true },
    departureTimes: { type: [String], required: true }
  }
);

export const Connection = mongoose.model<IConnection>("Connection", ConnectionSchema);