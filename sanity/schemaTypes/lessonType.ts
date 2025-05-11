import { defineType, defineField } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Bài giảng",
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
      title: "Bài giảng miễn phí",
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
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({
      name: "content",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
