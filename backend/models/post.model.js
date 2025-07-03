import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    popularity: {
        type: Number,
        default: 0
    },
    postImage: {
        url: { type: String, default: "", trim: true },
        public_id: { type: String, default: "", trim: true }
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tag: {
        type: String,
        enum: ["general", "query", "announcement", "event", "project"],
        default: "general"
    }
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);

export default Post;