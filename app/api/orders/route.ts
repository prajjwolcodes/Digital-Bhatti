import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET all orders (admin) or user's orders (user)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const whereClause: any = {}

    // If user is not admin, only show their orders
    if (session.user.role !== "ADMIN") {
      whereClause.userId = session.user.id
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
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

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 })
  }
}

// POST create a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, buyer } = body

    // Validate input
    if (!items || !items.length) {
      return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 })
    }

    // Get food items to calculate prices
    const foodItemIds = items.map((item: any) => item.foodItemId)
    const foodItems = await prisma.foodItem.findMany({
      where: {
        id: {
          in: foodItemIds,
        },
      },
    })

    // Create order items with correct prices
    const orderItems = items.map((item: any) => {
      const foodItem = foodItems.find((fi) => fi.id === item.foodItemId)
      if (!foodItem) {
        throw new Error(`Food item with ID ${item.foodItemId} not found`)
      }

      const price = Number.parseFloat(foodItem.price.toString())
      const quantity = item.quantity
      const total = price * quantity

      return {
        foodItemId: item.foodItemId,
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
        buyer,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Error creating order" }, { status: 500 })
  }
}

