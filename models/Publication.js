const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
  title: String,
  permalink: String,
  content: String,
  type: String,
  createdAt: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  updateTimeline: [
    {
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      updatedAt: Date,
    },
  ],
  comments: [
    {
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: String,
    },
  ],
});

module.exports = Publication = mongoose.model("publication", PublicationSchema);
