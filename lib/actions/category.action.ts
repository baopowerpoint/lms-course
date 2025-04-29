"use server";

import { sanityFetch } from "@/sanity/live";
import action from "../handler/action";
import handleError from "../handler/error";
import { CATEGORY_QUERY } from "@/sanity/queries";
import { parseStringify } from "../utils";
import { CATEGORY_QUERYResult } from "@/sanity/types";

export async function getCategories(): Promise<ActionResponse<CATEGORY_QUERYResult>> {
  const validationResult = await action({});
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  try {
    const categories = await sanityFetch({
      query: CATEGORY_QUERY,
    });
    return {
      success: true,
      data: parseStringify(categories.data),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
