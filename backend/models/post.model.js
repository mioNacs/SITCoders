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

// Virtual: number of comments associated with this post
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Ensure virtuals are included in JSON and Object outputs
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
