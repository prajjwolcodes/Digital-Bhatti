"use client"

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

const KhaltiPayment = ({ total_amount, orderId }: { total_amount: number, orderId: string | string[] | undefined }) => {
    const [loading, setLoading] = useState(false);


    const initiatePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/payment/khalti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: total_amount,
                    purchase_order_id: orderId,
                    purchase_order_name: `${orderId}NAMEUNKNOWN`,
                    orderId
                }),
            });

            const data = await response.json();
            console.log(data);
            if (data) window.location.href = data.payment_url;
        } catch (error: any) {
            console.error('Payment initiation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={initiatePayment} disabled={loading} type='submit' size="lg" className="bg-purple-700 text-white px-5 w-full mt-4 rounded-lg">{loading ? 'Processing...' : 'Pay with Khalti'}</Button>
    );
}

export default KhaltiPayment