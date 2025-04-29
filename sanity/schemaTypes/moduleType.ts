import {defineType, defineField} from 'sanity'

export const moduleType = defineType({
  name: 'module',
  title: 'Chương',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tên chương',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lessons',
      title: 'Bài giảng',
      type: 'array',
      of: [{type: 'reference', to: {type: 'lesson'}}],
    }),
  ],
})
