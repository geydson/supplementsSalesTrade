import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: String,
});

export default mongoose.model("User", UserSchema);
