import mongoose, { Schema, Types } from "mongoose";

interface IPost {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  community: Types.ObjectId;
  tags: string[];
  published: boolean;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

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

    tags: {
      type: [String],
      default: [],
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ community: 1, createdAt: -1 });
PostSchema.index({ published: 1, createdAt: -1 });

const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;