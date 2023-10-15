import mongoose from "mongoose";

const DashBoardSchema = new mongoose.Schema({
  clientId: String,
  codVend: String,
  totalPrice: Number,
  totalQuant: Number,
  dateCreated: Date,
  deleted: String,
});

export default mongoose.model("DashBoard", DashBoardSchema);
