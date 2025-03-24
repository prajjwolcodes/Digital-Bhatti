import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { token, amount } = await req.json();
        const secretKey = process.env.KHALTI_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json({ error: 'Missing secret key' }, { status: 500 });
        }

        const response = await fetch(
            'https://khalti.com/api/v2/payment/verify/',
            { method: "POST", body: JSON.stringify({ token, amount }), headers: { Authorization: `Key ${secretKey}` } }
        );

        if (!response.ok) throw new Error('Failed to verify payment')


        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 400 });
    }
}
