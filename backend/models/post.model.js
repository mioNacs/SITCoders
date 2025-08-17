import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    popularity: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    postImage: {
      url: { type: String, default: "", trim: true },
      public_id: { type: String, default: "", trim: true },
    },
    tag: {
      type: String,
      enum: ["general", "query", "announcement", "event", "project"],
      default: "general",
    },
    beenEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
