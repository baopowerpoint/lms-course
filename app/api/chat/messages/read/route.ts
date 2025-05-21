import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/database";
import { connectToDatabase } from "@/lib/db";

// POST /api/chat/messages/read - Mark messages as read for a user
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get data from request body
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Mark all messages from user to admin as read
    const result = await Message.updateMany(
      { 
        senderId: userId,
        receiverId: "admin",
        read: { $ne: true }
      },
      {
        $set: { read: true }
      }
    );
    
    return NextResponse.json({ 
      success: true,
      count: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
