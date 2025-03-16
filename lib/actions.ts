"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

// Food Item Actions
export async function getFoodItems() {
  try {
    const foodItems = await prisma.foodItem.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return foodItems
  } catch (error) {
    console.error("Error fetching food items:", error)
    return []
  }
}

export async function getFoodItem(id: string) {
  try {
    const foodItem = await prisma.foodItem.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    return foodItem
  } catch (error) {
    console.error("Error fetching food item:", error)
    return null
  }
}

export async function getFoodItemsByCategory(categoryId: string) {
  try {
    const foodItems = await prisma.foodItem.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return foodItems
  } catch (error) {
    console.error("Error fetching food items by category:", error)
    return []
  }
}

// Category Actions
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Order Actions
export async function createOrder(items: any[], address: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/auth/login")
    }

    // Get food items to calculate prices
    const foodItemIds = items.map((item) => item.id)
    const foodItems = await prisma.foodItem.findMany({
      where: {
        id: {
          in: foodItemIds,
        },
      },
    })

    // Create order items with correct prices
    const orderItems = items.map((item) => {
      const foodItem = foodItems.find((fi) => fi.id === item.id)
      if (!foodItem) {
        throw new Error(`Food item with ID ${item.id} not found`)
      }

      const price = Number.parseFloat(foodItem.price.toString())
      const quantity = item.quantity
      const total = price * quantity

      return {
        foodItemId: item.id,
        name: foodItem.name,
        price,
        quantity,
        total,
      }
    })

    // Calculate order total
    const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0)

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: orderTotal,
        address,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    revalidatePath("/orders")
    return order
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return []
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return orders
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

// Admin Actions
export async function getAllOrders() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      redirect("/auth/login")
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return orders
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return []
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      redirect("/auth/login")
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    revalidatePath("/admin")
    return updatedOrder
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}

export async function getAllUsers() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      redirect("/auth/login")
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the data to match the expected format
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      orders: user._count.orders,
    }))

    return formattedUsers
  } catch (error) {
    console.error("Error fetching all users:", error)
    return []
  }
}

