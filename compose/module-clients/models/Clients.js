import mongoose from "mongoose";

const ClientsSchema = new mongoose.Schema({
  codIdent: String,
  razaoSocial: String,
  nameFantasia: String,
  codVend: String || undefined,
  deleted: String,
  city: String,
  state: String,
  cep: String,
  bairro: String,
  logradouro: String,
  complement: String,
  number: String,
});

export default mongoose.model("Clients", ClientsSchema);
