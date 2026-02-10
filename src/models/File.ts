import mongoose, { Schema, Document, Types } from "mongoose";
import type { FileOrigin, FileKind } from "@/types";

export interface IFile extends Document {
  userId: Types.ObjectId;
  jobId?: Types.ObjectId;
  type: FileOrigin;
  fileType: FileKind;
  filename: string;
  originalFilename?: string;
  b2Key: string;
  url: string;
  sizeBytes?: number;
  mimeType?: string;
  metadata?: Record<string, unknown>;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    type: {
      type: String,
      enum: ["upload", "generated", "edited"],
      required: true,
    },
    fileType: { type: String, enum: ["image", "video"], required: true },
    filename: { type: String, required: true },
    originalFilename: { type: String },
    b2Key: { type: String, required: true },
    url: { type: String, required: true },
    sizeBytes: { type: Number },
    mimeType: { type: String },
    metadata: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.File ||
  mongoose.model<IFile>("File", FileSchema);
