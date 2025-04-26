"use server";

import { CreateUserParams, UpdateUserParams } from "@/types/action";
import action from "../handler/action";
import handleError from "../handler/error";
import { parseStringify } from "../utils";
import { User as UserModel } from "@/database";
import { revalidatePath } from "next/cache";
import { NotFoundError } from "../http-errors";


export async function createUser(params: CreateUserParams): Promise<ActionResponse<User>> {
  const validationResult = await action(
    { params }

  )
  if (validationResult instanceof Error) { return handleError(validationResult) as ErrorResponse }
  const { clerkId, name, username, email, picture } = validationResult.params!;
  try {
    const newUser = await UserModel.create({
      clerkId,
      name,
      username,
      email,
      picture
    })
    return {
      success: true,
      data: parseStringify(newUser)
    }

  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function updateUser(params: UpdateUserParams){
 const validationResult = await action({
    params
  })
    if(validationResult instanceof Error) return handleError(validationResult) as ErrorResponse
    const {clerkId, name, username, email, picture,path} = validationResult.params! 
    const updateData = {
    name,
    username,
    email,
    picture
  }
  try {
    const updateUser = await UserModel.findOneAndUpdate({clerkId}, updateData, {
      new: true
    }) 
    revalidatePath(path)
    return {
      success: true,
      data: parseStringify(updateUser)
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function deleteUser(params: {clerkId: string}){
  const validationResult = await action({
    params
  })
  if(validationResult instanceof Error) return handleError(validationResult) as ErrorResponse
  const {clerkId} = validationResult.params!
  try {
    const user = await UserModel.findOne({clerkId})
    if(!user) throw new NotFoundError('User')
    await UserModel.findByIdAndDelete(user._id)
    
    return {

      success: true,
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
