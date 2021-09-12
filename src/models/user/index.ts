import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date().getTime(),
  },
});
export default mongoose.model("User", userSchema);
