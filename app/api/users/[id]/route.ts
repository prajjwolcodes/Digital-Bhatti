import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET a specific user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = await params.id

    // If user is not admin and not the requested user, deny access
    if (session.user.role !== "ADMIN" && session.user.id !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
  }
}

// PUT update a user (admin or self)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // If user is not admin and not the user being updated, deny access
    if (session.user.role !== "ADMIN" && session.user.id !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, role } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (name) updateData.name = name

    // Only admin can change email and role
    if (session.user.role === "ADMIN") {
      if (email) {
        // Check if email is already taken by another user
        const emailExists = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (emailExists && emailExists.id !== id) {
          return NextResponse.json({ message: "Email already in use" }, { status: 409 })
        }

        updateData.email = email
      }

      if (role) updateData.role = role
    }

    // Handle password update
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
      }

      updateData.password = await hash(password, 10)
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Error updating user" }, { status: 500 })
  }
}

// DELETE a user (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = await params.id

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
  }
}

