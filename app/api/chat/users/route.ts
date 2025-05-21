import { NextRequest, NextResponse } from "next/server";
import { Message, User } from "@/database";
import dbConnect from "@/lib/mongoose";

// GET /api/chat/users - Get users who have chat messages
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Find unique users who have sent messages
    const messages = await Message.find({}).sort({ createdAt: -1 });

    // Get unique user IDs from messages
    const userIds = new Set<string>();
    const lastMessages: Record<string, any> = {};
    const unreadCounts: Record<string, number> = {};

    // Count messages and find last message for each user
    messages.forEach((message: any) => {
      const userId = message.senderId?.toString();
      if (userId && userId !== "admin") {
        userIds.add(userId);

        // Store last message for each user
        if (!lastMessages[userId]) {
          lastMessages[userId] = {
            content: message.content,
            timestamp: message.createdAt,
          };
        }

        // Count unread messages
        if (!message.read && message.receiverId === "admin") {
          unreadCounts[userId] = (unreadCounts[userId] || 0) + 1;
        }
      }
    });

    // Get user details
    const userList = await User.find({ clerkId: { $in: Array.from(userIds) } });

    // Format user data for the frontend
    const formattedUsers = userList.map((user: any) => {
      const userId = user.clerkId;
      return {
        id: userId,
        name: user.name || "Người dùng",
        email: user.email || "",
        unread: unreadCounts[userId] || 0,
        lastMessage: lastMessages[userId] || null,
      };
    });

    // Sort by unread count (desc) and then by last message time (desc)
    formattedUsers.sort((a, b) => {
      // First by unread count
      if (b.unread !== a.unread) {
        return b.unread - a.unread;
      }

      // Then by last message time
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      }

      return 0;
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
