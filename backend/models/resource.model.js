import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        link: {
            type: String,
            required: true,
            trim: true,
            match: [/^https?:\/\/.+/, "Please enter a valid URL"],
        },
        category: {
            type: String,
            enum: ["Career Guides", "Roadmaps", "Playlists", "Notes & PYQs"],
            required: true,
        },
        tags: { type: [String], default: [] },
        thumbnail: { type: String, default: null },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdByAdmin: { type: Boolean, default: false },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

resourceSchema.index({ title: "text", description: "text", tags: "text" });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
