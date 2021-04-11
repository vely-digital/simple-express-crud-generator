const mongoose = require("mongoose");
const Generator = require("../dist/index");

const modelSchema = new mongoose.Schema(
  {
    cat: {
      type: String,
      required: true,
      index: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const listOptions = {
  listSelect: "-_id",
};

Generator.generateModel(modelSchema, listOptions);

module.exports = mongoose.model("Model", modelSchema);
