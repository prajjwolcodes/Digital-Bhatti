"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import type { FoodItem } from "@/lib/types"

interface CartItem extends FoodItem {
  quantity: number
}

export async function createOrder(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/auth/login?callbackUrl=/checkout")
    }

    // Get cart items from localStorage (passed from client)
    const cartItemsJson = formData.get("cartItems") as string
    const cartItems: CartItem[] = JSON.parse(cartItemsJson)

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty")
    }

    // Create address object
    const address = {
      street: formData.get("address") as string,
      apartment: formData.get("apartment") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zip") as string,
      instructions: formData.get("delivery-instructions") as string,
    }

    // Create contact information
    const contactInfo = {
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      foodItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }))

    // Calculate order total
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const deliveryFee = 3.99
    const tax = subtotal * 0.08
    const total = subtotal + deliveryFee + tax

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PENDING",
        address: {
          ...address,
          ...contactInfo,
        },
        items: {
          create: orderItems,
        },
      },
    })

    revalidatePath("/orders")
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

