import mongoose from "mongoose";
import { ENV } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("Połączono z MongoDB");
  } catch (error) {
    console.error("Błąd połączenia z MongoDB: ", error);
    process.exit(1);
  }
}