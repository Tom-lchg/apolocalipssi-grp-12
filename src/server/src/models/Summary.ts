import mongoose, { Document, Schema } from "mongoose";

export interface ISummary extends Document {
  user: mongoose.Types.ObjectId;
  originalText: string;
  summary: string;
  keyPoints: string[];
  createdAt: Date;
}

const summarySchema = new Schema<ISummary>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalText: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Summary = mongoose.model<ISummary>("Summary", summarySchema);