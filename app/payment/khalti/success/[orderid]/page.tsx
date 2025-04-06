'use client'

// pages/payment-success.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
    const orderId = useParams().orderid
    const searchParams = useSearchParams()
    const pidx = searchParams.get('pidx')
    const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAIL'>('PENDING')

    useEffect(() => {
        const verifyPayment = async () => {
            if (!pidx) return

            try {
                const res = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
                    },
                    body: JSON.stringify({ pidx }),
                })

                if (!res.ok) {
                    throw new Error('Failed to verify payment')
                }

                const data = await res.json()
                console.log(data)

                if (res.ok) {
                    setPaymentStatus('SUCCESS')
                    try {
                        const response = await fetch(`/api/orders/${orderId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                paymentMethod: "ONLINE",
                                paymentStatus: "PAID",
                            }),
                        });
                        if (!response.ok) {
                            throw new Error('Failed to fetch order details');
                        }
                        const orderDetails = await response.json();
                        console.log(orderDetails);
                    } catch (error) {
                        console.error('Error fetching order details:', error);
                    }
                } else {
                    setPaymentStatus('FAIL')
                }
            } catch (err) {
                setPaymentStatus('FAIL')
            }
        }

        verifyPayment()
    }, [pidx])

    const router = useRouter()

    // if (!data || data.status !== 'COMPLETE') return router.replace('/payment/esewa/failure')
    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex flex-col items-center gap-5 justify-center mb-6">
                    {/* <h1 className='font-bold text-green-600 text-xl'>Rs 10.50</h1> */}
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your transaction has been completed successfully.
                    You can now successfully place your order
                </p>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col space-y-3">
                        <Link href="/" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            Go back to home
                        </Link>
                        {/* <Link href="/orders" className="inline-flex items-center justify-center bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            View My Orders
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
}