import mongoose, { Schema, Types } from "mongoose";

interface IPost {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  community: Types.ObjectId;
  tags: string[];
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;