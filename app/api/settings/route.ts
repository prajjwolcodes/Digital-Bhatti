import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    console.log("here")
    const data = await prisma.shop.findMany()
    return Response.json(data)
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }


    try {
        const { name, email, phone, instagram, facebook, address } = await req.json()
        const data = await prisma.shop.update({
            where: { id: "cm8e0036c0000i0bn44f29w02" },
            data: { name, email, phone, instagram, facebook, address },
        })
        return Response.json({ data, message: "Shop data updated" })
    } catch (error) {
        console.log("Error updating shop data:", error)
        return Response.json({ message: "Error updating shop data" })

    }
}