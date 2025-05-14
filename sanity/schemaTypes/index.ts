import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import { courseType } from './courseType'
import { lessonType } from './lessonType'
import { moduleType } from './moduleType'
import { studentType } from './studentType'
import { questionType } from './questionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType,
  authorType,
  categoryType,
    courseType,
    lessonType,
    moduleType,
    postType,
    studentType,
    questionType
  ],
}
