"use server";

import dbConnect from "@/lib/mongoose";
import { User, Enrollment } from "@/database";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Create enrollments for user after order is completed
export async function createEnrollmentsFromOrder(
  userId: string,
  courseIds: string[]
) {
  try {
    await dbConnect();

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // Create enrollments for each course
    const enrollments = [];

    for (const courseId of courseIds) {
      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        user: user._id,
        course: courseId,
      });

      if (!existingEnrollment) {
        // Create a new enrollment
        const enrollment = await Enrollment.create({
          user: user._id,
          course: courseId,
          enrolledAt: new Date(),
          lastAccessed: new Date(),
        });

        enrollments.push(enrollment);
      }
    }

    // Revalidate the user's courses page
    revalidatePath("/dashboard/courses");

    return enrollments;
  } catch (error) {
    console.error("Error creating enrollments:", error);
    throw new Error("Failed to create enrollments");
  }
}

// Check if the current user has access to a specific course
export async function checkCourseAccess(courseId: string) {
  try {
    await dbConnect();

    // Get the current user
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return false;
    }

    // Check if the user has an enrollment for this course
    const enrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking course access:", error);
    return false;
  }
}

// Get all enrollments for the current user
export async function getUserEnrollments() {
  try {
    await dbConnect();

    // Get the current user
    const { userId } = await auth();

    if (!userId) {
      return [];
    }

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return [];
    }

    // Get all enrollments for the user
    const enrollments = await Enrollment.find({
      user: user._id,
    }).lean();

    return enrollments.map((enrollment) => ({
      id: enrollment._id.toString(),
      courseId: enrollment.course,
      enrolledAt: enrollment.enrolledAt,
      completedLessons: enrollment.completedLessons,
      isCompleted: enrollment.isCompleted,
      lastAccessed: enrollment.lastAccessed,
    }));
  } catch (error) {
    console.error("Error getting user enrollments:", error);
    return [];
  }
}

// Update order status and create enrollments
export async function completeOrderAndEnrollUser(orderId: string) {
  try {
    await dbConnect();

    // Find the order
    const Order = (await import("@/database/order.model")).default;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Update order status to completed
    order.status = "completed";
    await order.save();

    // Get the user
    const user = await User.findById(order.user);

    if (!user) {
      throw new Error("User not found");
    }

    // Create enrollments for each course in the order
    await createEnrollmentsFromOrder(user.clerkId, order.items);

    // Revalidate paths
    revalidatePath(`/checkout/confirmation/${orderId}`);
    revalidatePath("/admin/orders");

    return true;
  } catch (error) {
    console.error("Error completing order:", error);
    return false;
  }
}
