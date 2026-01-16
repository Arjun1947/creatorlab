import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["caption", "bio"],
      required: true,
    },

    input: {
      type: Object,
      required: true,
    },

    result: {
      type: Object,
      required: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserData", userDataSchema);
