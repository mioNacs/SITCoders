import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdminVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      url: { type: String, default: "", trim: true },
      public_id: { type: String, default: "", trim: true },
    },
    rollNo: {
      required: true,
      type: String,
      trim: true,
      unique: true,
      index:true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },

    popularity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionEnd: {
      type: Date,
      default: null, // Default to epoch time
    },

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
