import { NextResponse } from "next/server";
import { getCategories } from "@/lib/actions/sanity.actions";

export async function GET() {
  try {
    const result = await getCategories();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in categories API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
