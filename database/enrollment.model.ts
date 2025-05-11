import { models, model, Schema, Document, Types } from "mongoose";

export interface IEnrollment {
  user: Types.ObjectId;
  course: string;
  enrolledAt: Date;
  completedLessons: string[];
  isCompleted: boolean;
  lastAccessed: Date;
}

export interface IEnrollmentDocument extends IEnrollment, Document {}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedLessons: { type: [String], default: [] },
    isCompleted: { type: Boolean, default: false },
    lastAccessed: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only enroll in a course once
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = models?.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);
export default Enrollment;
