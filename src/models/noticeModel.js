import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  source: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  link: { type: String, required: true },
});

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
