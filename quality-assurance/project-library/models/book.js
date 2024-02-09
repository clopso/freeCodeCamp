const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    commentcount: { type: Number, default: 0 },
    comments: { type: [String], default: [] },
  },
  { versionKey: false }
);

const BookModel = mongoose.model("Book", BookSchema, "Books");
module.exports = BookModel;