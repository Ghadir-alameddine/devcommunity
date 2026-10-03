import mongoose, { Schema, Types } from "mongoose";

interface IMembership {
  user: Types.ObjectId;
  community: Types.ObjectId;
}

const MembershipSchema = new Schema<IMembership>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  { timestamps: true }
);

MembershipSchema.index(
  { user: 1, community: 1 },
  { unique: true }
);

const Membership =
  mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;