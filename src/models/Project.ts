import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  files: Types.ObjectId[];
  isStarred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
    isStarred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
