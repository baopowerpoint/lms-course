
"use server";

import { ZodError, ZodSchema } from "zod";
import dbConnect from "../mongoose";
import { auth } from "@clerk/nextjs/server";
import { UnauthorizedError, ValidationError } from "../http-errors";
type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
  enableDb?: boolean;
};

// * 1. Check if schema and params are provided and validated
// * 2. Check if user is authorized
// * 3. Connect to database
// * 4. Return the params and userId.

async function action<T>({
  params,
  schema,
  authorize = false,
  enableDb = true,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }
  //session
  let userId: string | null = null;
  if (authorize) {
    userId = (await auth()).userId;
    if (!userId) return new UnauthorizedError();
  }
  if (enableDb) await dbConnect();
  return { params, userId };
}
export default action;
