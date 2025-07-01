import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ["superadmin", "admin"],
        default: "admin"
    },
},{timestamps: true});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;