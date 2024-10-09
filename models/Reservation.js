// ================
import mongoose from "mongoose";
const { Schema } = mongoose;

const reservationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  tableNumber: { type: Number, required: true },
  numberOfGuests: { type: Number, required: true },
  status: {
    type: String,
    enum: ["booked", "completed", "canceled"],
    default: "booked",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
