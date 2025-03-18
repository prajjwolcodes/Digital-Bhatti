import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET a specific category by ID
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        foodItems: true,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ message: "Error fetching category" }, { status: 500 })
  }
}

// PUT update a category (admin only)
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()
    const { name, description } = body

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ message: "Error updating category" }, { status: 500 })
  }
}

// DELETE a category (admin only)
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        foodItems: true,
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if category has food items
    if (existingCategory.foodItems.length > 0) {
      return NextResponse.json({ message: "Cannot delete category with associated food items" }, { status: 400 })
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 })
  }
}

