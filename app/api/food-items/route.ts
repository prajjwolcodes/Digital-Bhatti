import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET all food items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    const whereClause = categoryId ? { categoryId } : {}

    const foodItems = await prisma.foodItem.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ message: "Error fetching food items" }, { status: 500 })
  }
}

// POST create a new food item (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, image, ingredients, nutritionalInfo, categoryId } = body

    // Validate input
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
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

    // Create the food item
    const foodItem = await prisma.foodItem.create({
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

    return NextResponse.json(foodItem, { status: 201 })
  } catch (error) {
    console.error("Error creating food item:", error)
    return NextResponse.json({ message: "Error creating food item" }, { status: 500 })
  }
}

