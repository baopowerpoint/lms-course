import { Document, Schema, model, models } from "mongoose";

// Interface cho một câu hỏi
export interface IQuestion extends Document {
  id: number;
  position: number;
  title: string; // HTML content
  type: string; // "radiogroup", "filltext", v.v.
  formattedTitle?: string; // HTML với input fields cho filltext
  choices: string[];
  correctAnswer: string | string[];
}

// Schema cho câu hỏi
const QuestionSchema = new Schema<IQuestion>({
  id: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  formattedTitle: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: false, // Một số câu hỏi có thể không có lựa chọn
  },
  correctAnswer: {
    type: Schema.Types.Mixed, // Cho phép cả String và [String]
    required: true,
  },
});

// Interface cho một bài kiểm tra
export interface ITest extends Document {
  id: number;
  name: string;
  display_type: number;
  lecture?: {
    id: number;
    name: string;
  };
  course?: {
    id: number | null;
    name: string | null;
  };
  subject?: {
    id: number;
    name: string;
  };
  grade?: {
    id: number;
    name: string;
  };
  questions: IQuestion[];
  lessonId?: string; // ID của lesson nếu bài kiểm tra được gán cho một lesson
}

// Schema cho bài kiểm tra
const TestSchema = new Schema<ITest>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    display_type: {
      type: Number,
      required: true,
    },
    lecture: {
      id: Number,
      name: String,
    },
    course: {
      id: Number,
      name: String,
    },
    subject: {
      id: Number,
      name: String,
    },
    grade: {
      id: Number,
      name: String,
    },
    questions: [QuestionSchema],
    lessonId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo các index để tối ưu việc tìm kiếm
TestSchema.index({ name: "text" });
TestSchema.index({ "subject.id": 1, "grade.id": 1 });

const Test = models?.Test || model<ITest>("Test", TestSchema);

export default Test;
