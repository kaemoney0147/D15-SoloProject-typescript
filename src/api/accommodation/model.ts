import mongoose from "mongoose";
const { Schema, model } = mongoose;

const accomodationsSchema = new Schema<AccommodationInterface>(
  {
    name: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true, max: 5 },
    city: { type: String, required: true },
  },
  { timestamps: true }
);
export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  timestamps: boolean;
}

export interface AccommodationInterface {
  host: UserInterface;
  name: string;
  maxGuests: number;
  description: string;
  city: string;
}
export default model("accommodations", accomodationsSchema);
