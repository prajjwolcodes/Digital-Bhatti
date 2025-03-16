import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET a specific food item by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const foodItem = await prisma.foodItem.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    if (!foodItem) {
      return NextResponse.json({ message: "Food item not found" }, { status: 404 })
    }

    return NextResponse.json(foodItem)
  } catch (error) {
    console.error("Error fetching food item:", error)
    return NextResponse.json({ message: "Error fetching food item" }, { status: 500 })
  }
}

// PUT update a food item (admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()
    const { name, description, price, image, ingredients, nutritionalInfo, categoryId } = body

    // Validate input
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if food item exists
    const existingFoodItem = await prisma.foodItem.findUnique({
      where: {
        id,
      },
    })

    if (!existingFoodItem) {
      return NextResponse.json({ message: "Food item not found" }, { status: 404 })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Update the food item
    const updatedFoodItem = await prisma.foodItem.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        image,
        ingredients: ingredients || [],
        nutritionalInfo: nutritionalInfo || {},
        categoryId,
      },
    })

    return NextResponse.json(updatedFoodItem)
  } catch (error) {
    console.error("Error updating food item:", error)
    return NextResponse.json({ message: "Error updating food item" }, { status: 500 })
  }
}

// DELETE a food item (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if food item exists
    const existingFoodItem = await prisma.foodItem.findUnique({
      where: {
        id,
      },
    })

    if (!existingFoodItem) {
      return NextResponse.json({ message: "Food item not found" }, { status: 404 })
    }

    // Delete the food item
    await prisma.foodItem.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Food item deleted successfully" })
  } catch (error) {
    console.error("Error deleting food item:", error)
    return NextResponse.json({ message: "Error deleting food item" }, { status: 500 })
  }
}

