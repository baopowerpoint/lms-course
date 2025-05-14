import { defineType, defineField } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Bài học",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isPreview",
      title: "Bài học miễn phí",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "slug",
      title: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
    }),
    defineField({
      name: "lessonType",
      title: "Loại bài học",
      type: "string",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Bài kiểm tra", value: "quiz" },
        ],
      },
      initialValue: "video",
      validation: (rule) => rule.required(),
    }),
    // Video fields
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      hidden: ({ document }) => document?.lessonType !== "video",
    }),
    defineField({
      name: "content",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }],
      hidden: ({ document }) => document?.lessonType !== "video",
    }),
    // Quiz fields
    defineField({
      name: "questions",
      title: "Câu hỏi",
      type: "array",
      of: [{ type: "reference", to: { type: "question" } }],
      hidden: ({ document }) => document?.lessonType !== "quiz",
      validation: (Rule) =>
        Rule.custom((questions, context) => {
          // Only validate if this is a quiz lesson
          if (
            context.document?.lessonType === "quiz" &&
            (!questions || questions.length === 0)
          ) {
            return "Bài kiểm tra phải có ít nhất một câu hỏi";
          }
          return true;
        }),
    }),
    defineField({
      name: "passingScore",
      title: "Điểm đạt yêu cầu (%)",
      type: "number",
      hidden: ({ document }) => document?.lessonType !== "quiz",
      validation: (rule) => rule.min(0).max(100),
      initialValue: 70,
    }),
    defineField({
      name: "timeLimit",
      title: "Thời gian làm bài (phút)",
      type: "number",
      hidden: ({ document }) => document?.lessonType !== "quiz",
      validation: (rule) => rule.min(0),
      description: "Đặt 0 nếu không giới hạn thời gian",
      initialValue: 0,
    }),
  ],
});
