import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [userCount, foodCount, orderCount, revenue, cancelledRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.foodItem.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: { not: "CANCELLED" } }, // Exclude cancelled orders
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: "CANCELLED" }, // Exclude cancelled orders
            }),
        ]);

        const data = {
            userCount,
            foodCount,
            orderCount,
            revenue: revenue._sum.total,
            cancelledRevenue: cancelledRevenue._sum.total
        };

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "error in getting statistics data" }, { status: 500 });

    }
}
