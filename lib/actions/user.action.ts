"use server";

import dbConnect from "../mongoose";

export async function createUser() {
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
  }
}
