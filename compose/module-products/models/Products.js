import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  codProd: String,
  name: String,
  desc: String,
  price: Number,
  stock: Number,
  dateCreated: Date,
  deleted: String,
});

export default mongoose.model("Products", ProductsSchema);
