import {defineField, defineType} from 'sanity'

export const studentType = defineType({
  name: 'student',
  title: 'Hoc sinh',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
    }),

    defineField({
      name: 'email',
      title: 'email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clerkId',
      title: 'clerkId',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'picture',
      title: 'Profile Image url',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      username: 'username',
      picture: 'picture',
    },
    prepare({username, picture}) {
      return {
        title: ` ${username}`,
        media: <img src={picture} alt={`${username} picture`} width={100} height={100} />,
      }
    },
  },
})
