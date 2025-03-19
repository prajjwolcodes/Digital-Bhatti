import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const userCount = await prisma.user.count();
        const foodCount = await prisma.foodItem.count();
        const orderCount = await prisma.order.count();
        const revenue = await prisma.order.aggregate({
            _sum: {
                total: true
            }
        });

        const data = {
            userCount,
            foodCount,
            orderCount,
            revenue: revenue._sum.total
        };

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "error in getting statistics data" }, { status: 500 });

    }
}
