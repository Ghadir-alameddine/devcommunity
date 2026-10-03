import mongoose, { Schema, Types } from "mongoose";

interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;