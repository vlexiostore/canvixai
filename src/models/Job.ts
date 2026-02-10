import mongoose, { Schema, Document, Types } from "mongoose";
import type { JobType, JobStatus } from "@/types";

export interface IJob extends Document {
  userId: Types.ObjectId;
  type: JobType;
  status: JobStatus;
  inputData: {
    prompt?: string;
    imageUrl?: string;
    settings?: Record<string, unknown>;
  };
  pixlrJobId?: string;
  resultUrl?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, unknown>;
  creditsCost: number;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "image-gen",
        "video-gen",
        "image-to-video",
        "remove-bg",
        "upscale",
        "gen-fill",
        "expand",
        "sharpen",
        "denoise",
        "face-swap",
        "object-remove",
        "bg-change",
        "edit",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    inputData: {
      prompt: { type: String },
      imageUrl: { type: String },
      settings: { type: Schema.Types.Mixed },
    },
    pixlrJobId: { type: String, index: true },
    resultUrl: { type: String },
    thumbnailUrl: { type: String },
    metadata: { type: Schema.Types.Mixed },
    creditsCost: { type: Number, required: true },
    error: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Job ||
  mongoose.model<IJob>("Job", JobSchema);
