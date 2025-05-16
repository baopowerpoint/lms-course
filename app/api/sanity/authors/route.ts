import { NextResponse } from "next/server";
import { getAuthors } from "@/lib/actions/sanity.actions";

export async function GET() {
  try {
    const result = await getAuthors();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in authors API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
