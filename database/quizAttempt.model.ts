import { Document, Schema, model, models } from "mongoose";

export interface IQuizAttempt extends Document {
  userId: string;
  lessonId: string;
  courseId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  attemptDetails: {
    answers: Record<string, any>;
    completedAt: Date;
  };
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
      default: false,
    },
    attemptDetails: {
      answers: {
        type: Schema.Types.Mixed,
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index on userId, courseId, and lessonId to efficiently query attempts
QuizAttemptSchema.index({ userId: 1, courseId: 1, lessonId: 1 });

const QuizAttempt =
  models?.QuizAttempt || model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
