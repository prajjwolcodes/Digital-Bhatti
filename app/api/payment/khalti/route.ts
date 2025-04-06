// pages/api/initiate-khalti-payment.js
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { amount, purchase_order_id, purchase_order_name, orderId } = await req.json()
    console.log(amount, process.env.KHALTI_SECRET_KEY);
    const amountInNumber = Number(amount) * 100;

    const payload = {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/khalti/success/${orderId}`,
        website_url: process.env.NEXT_PUBLIC_BASE_URL,
        amount: amountInNumber, purchase_order_id, purchase_order_name,
    };

    try {
        const khaltiResponse = await fetch(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
                body: JSON.stringify({
                    ...payload
                }),
            }
        );

        const data = await khaltiResponse.json();
        console.log(data);

        return Response.json(data);
    } catch (error: any) {
        return Response.json({ error: error.message });
    }

}
