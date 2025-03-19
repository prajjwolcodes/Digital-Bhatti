import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    const data = await prisma.shop.findMany()
    return Response.json(data)
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const requestData = await req.json()
        const { tabType, ...updateData } = requestData

        let dataToUpdate = {}

        if (tabType === "general") {
            dataToUpdate = {
                name: updateData.name,
                email: updateData.email,
                phone: updateData.phone,
                instagram: updateData.instagram,
                facebook: updateData.facebook,
                twitter: updateData.twitter,
                address: updateData.address,
            }
        } else if (tabType === "payment") {
            dataToUpdate = {
                taxRate: updateData.taxRate,
                deliveryEnabled: updateData.deliveryEnabled,
                ...(updateData.deliveryEnabled ? { deliveryCharge: updateData.deliveryCharge } : 0),
            }
            console.log(dataToUpdate)
        } else if (tabType === "notifications") {
            // Add notification fields here
            dataToUpdate = {
                // Notification specific fields
            }
        } else if (tabType === "appearance") {
            // Add appearance fields here
            dataToUpdate = {
                // Appearance specific fields
            }
        }

        const data = await prisma.shop.update({
            where: { id: "cm8e0036c0000i0bn44f29w02" },
            data: dataToUpdate,
        })

        console.log(data)

        return Response.json({
            data,
            message: `${tabType.charAt(0).toUpperCase() + tabType.slice(1)} settings updated successfully`
        })
    } catch (error) {
        return Response.json({ message: "Error updating shop data", error }, { status: 500 })
    }
}