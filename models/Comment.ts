import mongoose, { Schema, Types } from "mongoose";

interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

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

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });

const Comment =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;