"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoose";
import { Order as OrderModel, User, Enrollment } from "@/database";
import { auth } from "@clerk/nextjs/server";
import action from "../handler/action";
import handleError from "../handler/error";
import { CreateOrderParams } from "@/types/action";
import { NotFoundError } from "../http-errors";
import { parseStringify } from "../utils";
import { createEnrollmentsFromOrder } from "./enrollment.action";

export interface Order {
  id: string;
  userId: string;
  clerkId: string;
  items: string[];
  total: number;
  paymentMethod: "bank_transfer" | "momo";
  status: "pending" | "completed" | "cancelled";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new order
 */
export async function createOrder(params: CreateOrderParams) {
  const validationResult = await action({
    authorize: true,
    params,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { items, total, paymentMethod } = validationResult.params!;
  const userId = validationResult.userId;
  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new NotFoundError("user");
    const order = await OrderModel.create({
      user: user._id,
      items,
      total,
      paymentMethod,
    });
    return {
      success: true,
      data: parseStringify(order),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
/**
 * Get an order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    await dbConnect();

    const order = await OrderModel.findById(id);
    if (!order) return null;

    return {
      id: order._id.toString(),
      userId: order.userId,
      clerkId: order.clerkId,
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

/**
 * Get orders for a user
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    await dbConnect();

    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });

    return orders.map((order) => ({
      id: order._id.toString(),
      userId: order.userId,
      clerkId: order.clerkId,
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Get orders for the current authenticated user
 */
export async function getMyOrders(): Promise<Order[]> {
  try {
    await dbConnect();

    // Get the authenticated user's clerk ID
    const session = await auth();
    const clerkId = session?.userId;
    if (!clerkId) {
      throw new Error("User not authenticated");
    }

    const orders = await OrderModel.find({ clerkId }).sort({ createdAt: -1 });

    return orders.map((order) => ({
      id: order._id.toString(),
      userId: order.userId,
      clerkId: order.clerkId,
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: "pending" | "completed" | "cancelled",
  transactionId?: string
): Promise<Order | null> {
  try {
    await dbConnect();

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          ...(transactionId && { transactionId }),
        },
      },
      { new: true }
    );

    if (!updatedOrder) return null;

    // Revalidate relevant paths
    revalidatePath(`/checkout/confirmation/${id}`);

    return {
      id: updatedOrder._id.toString(),
      userId: updatedOrder.userId,
      clerkId: updatedOrder.clerkId,
      items: updatedOrder.items,
      total: updatedOrder.total,
      paymentMethod: updatedOrder.paymentMethod,
      status: updatedOrder.status,
      transactionId: updatedOrder.transactionId,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}
