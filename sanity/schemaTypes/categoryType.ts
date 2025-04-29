import {defineType, defineField} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Danh mục',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên danh mục',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Mô tả',
      type: 'text',
    }),
  ],
})
