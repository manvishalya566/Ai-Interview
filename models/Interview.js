import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    questions: [String],
    answers: [String],
    scores: { type: Map, of: Number },
    overallScore: { type: Number },
    feedback: String,
    skillsAssessed: [String],
    duration: Number,
    type: String,
  },
  { timestamps: true }
);

const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

export default Interview;
