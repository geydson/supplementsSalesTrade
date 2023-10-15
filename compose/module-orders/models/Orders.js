import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
  state: String,
  codIdent: String,
  razaoSocial: String,
  nameFantasia: String,
  quantItens: Number,
  total: Number,
  dateCreated: Date,
  codVend: String,
  deleted: String,
});

export default mongoose.model("Orders", OrdersSchema);
