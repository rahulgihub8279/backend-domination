import mongoose from "mongoose";
import MAP from "mongoose-paginate-v2";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    vedio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vedio",
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  },
  { timestamps: true }
);

commentSchema.plugin(MAP);
export const Comment = mongoose.model("Comment", commentSchema);
