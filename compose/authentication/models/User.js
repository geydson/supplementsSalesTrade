import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: Number,
  codVend: String || undefined,
  deleted: String,
});

export default mongoose.model("User", UserSchema);
