import {defineType, defineField} from 'sanity'

export const courseType = defineType({
  name: 'course',
  title: 'Khóa học',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tên khóa học',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Giá (VND)',
      type: 'number',
      description: 'Giá khóa học',
      validation: (rule) => rule.min(0),
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
      name: 'description',
      title: 'Mô tả',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Hình ảnh',
      type: 'image',
    }),
    defineField({
      name: 'category',
      title: 'Danh mục',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [{type: 'reference', to: {type: 'module'}}],
    }),
    defineField({
      name: 'author',
      title: 'Giảng viên',
      type: 'reference',
      to: {type: 'author'},
    }),
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Các tag liên quan đến sản phẩm, giúp việc tìm kiếm và phân loại được dễ dàng',
    },
  ],
})
