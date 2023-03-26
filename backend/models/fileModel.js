const mongoose = require("mongoose");
const { COLLECTION_FILES } = require("../config/db");

const FILE = "file";

const fileSchema = mongoose.Schema(
  {
    url: String,
    type: { type: String, default: FILE },
    name: String,
  },
  { timestamps: true }
);

const Files = mongoose.model("Files", fileSchema, COLLECTION_FILES);

module.exports = Files;