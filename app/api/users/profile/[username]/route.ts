import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET user by username
export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is authenticated
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { username } = await params

        // Find the user by username (which could be their name or email)
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ name: { equals: username, mode: "insensitive" } }, { email: { equals: username, mode: "insensitive" } }],
            },
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
        })


        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // If user is not admin and not the requested user, deny access
        if (session.user.role !== "ADMIN" && session.user.id !== user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Transform the data to match the expected format
        const formattedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            orders: user._count.orders,
        }

        return NextResponse.json(formattedUser)
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
    }
}

