import { defineQuery } from "next-sanity";

export const COURSES_QUERY = defineQuery(`*[_type == "course"]`);

export const CATEGORY_QUERY = defineQuery(`*[_type == "category"]`);
