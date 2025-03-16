import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 })
  }
}

// POST create a new category (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    })

    if (existingCategory) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 })
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ message: "Error creating category" }, { status: 500 })
  }
}

