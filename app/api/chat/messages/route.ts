import { NextRequest, NextResponse } from "next/server";
import { Message, User } from "@/database";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

// GET /api/chat/messages - Get messages for a user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get user ID from query parameter
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    // If no user ID found, return error
    if (!queryUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userId = queryUserId;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    // Get messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: 1 })
      .limit(limit);

    // Get user details for each sender
    const userIds = [...new Set(messages.map((m) => m.senderId))];
    const users = await User.find({ clerkId: { $in: userIds } });
    const userMap = users.reduce(
      (map, user) => {
        map[user.clerkId] = {
          name: user.name,
          isAdmin: user.role === "admin",
        };
        return map;
      },
      {} as Record<string, { name: string; isAdmin: boolean }>
    );

    // Format messages for the frontend
    const formattedMessages = messages.map((message) => {
      // Convert to Document type to access properties safely
      const messageDoc = message as any;
      const senderId = messageDoc.senderId?.toString() || "";
      const sender = userMap[senderId] || { name: "User", isAdmin: false };

      return {
        id: messageDoc._id?.toString() || "",
        content: messageDoc.content || "",
        senderId: senderId,
        receiverId: messageDoc.receiverId?.toString() || "",
        senderName: sender.name,
        timestamp: messageDoc.createdAt || new Date(),
        isAdmin: sender.isAdmin,
      };
    });

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get data from request body
    const body = await req.json();
    const { content, receiverId, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create the message
    const message = await Message.create({
      content,
      senderId: userId,
      receiverId: receiverId || "admin", // Default receiver is admin
    });

    // Get sender info - handle case when user might not exist yet
    let sender;
    try {
      sender = await User.findById(userId);
    } catch (error) {
      console.log("Error finding user, will use default values", error);
    }

    // Format for the frontend using any to access properties safely
    const messageDoc = message.toObject ? message.toObject() : message;

    const formattedMessage = {
      id: messageDoc._id?.toString() || "",
      content: messageDoc.content || "",
      senderId: messageDoc.senderId?.toString() || "",
      receiverId: messageDoc.receiverId?.toString() || "",
      senderName: sender?.name || "Bạn", // Default to 'Bạn' if no user found
      timestamp: messageDoc.createdAt || new Date(),
      isAdmin: sender?.role === "admin" || false,
    };

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
