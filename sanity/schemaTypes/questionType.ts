import { defineType, defineField } from "sanity";

export const questionType = defineType({
  name: "question",
  title: "Câu hỏi",
  type: "document",
  fields: [
    defineField({
      name: "content",
      title: "Nội dung câu hỏi",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Loại câu hỏi",
      type: "string",
      options: {
        list: [
          { title: "Trắc nghiệm một đáp án", value: "singleChoice" },
          { title: "Trắc nghiệm nhiều đáp án", value: "multipleChoice" },
          { title: "Điền câu trả lời", value: "fillInBlank" },
          { title: "Câu hỏi tự luận", value: "essay" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "choices",
      title: "Các lựa chọn",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", type: "string", title: "Nội dung" },
            { name: "isCorrect", type: "boolean", title: "Đúng" },
          ],
        },
      ],
      hidden: ({ document }) => 
        !document?.type || 
        (document.type !== "singleChoice" && 
         document.type !== "multipleChoice"),
    }),
    defineField({
      name: "correctAnswer",
      title: "Đáp án đúng",
      type: "string",
      hidden: ({ document }) => 
        !document?.type || 
        document.type !== "fillInBlank",
    }),
    defineField({
      name: "points",
      title: "Điểm",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "explanation",
      title: "Giải thích đáp án",
      type: "text",
    }),
  ],
});
