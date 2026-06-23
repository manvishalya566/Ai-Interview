import mongoose from "mongoose";

const questionFeedbackSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  aiFeedback: String,
  score: Number,
  correctApproach: String,
  improvement: String,
}, { _id: false });

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
    company: { type: String, default: "General" },
    role: { type: String, default: "Software Engineer" },
    difficulty: { type: String, default: "Medium" },
    questionFeedback: [questionFeedbackSchema],
    strengths: [String],
    weaknesses: [String],
    aiSuggestions: [String],
    recommendedTopics: [{ name: String, priority: String }],
    skillBreakdown: [{ name: String, score: Number, readiness: Number, improvement: String, trend: String }],
    weeklyPerformance: [{ day: String, score: Number }],
    timelineEvents: [{ time: String, title: String, description: String, status: String }],
    status: { type: String, default: "Completed" },
  },
  { timestamps: true }
);

const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

export default Interview;
