import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema({
  id: String,
  codProd: String,
  name: String,
  price: Number,
  quant: Number,
  deleted: String,
});

export default mongoose.model("Items", ItemsSchema);
