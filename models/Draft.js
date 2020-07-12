const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DraftSchema = new Schema(
  {
    publicationId: Schema.Types.ObjectId,
    title: String,
    permalink: String,
    content: String,
    type: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Draft = mongoose.model("draft", DraftSchema);
