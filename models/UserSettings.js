import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    notifications: {
      feedback: { type: Boolean, default: true },
      weekly: { type: Boolean, default: true },
      reminders: { type: Boolean, default: false },
      updates: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const UserSettings = mongoose.models.UserSettings || mongoose.model("UserSettings", userSettingsSchema);

export default UserSettings;
