'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const page = () => {
    const [payment, setPayment] = React.useState({
        amount: "100",
        tax_amount: "10",
        total_amount: "110",
        transaction_uuid: uuidv4(),
        product_code: 'EPAYTEST',
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: 'http://localhost:3000/success',
        failure_url: 'http://localhost:3000/failure',
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: '',
        secret: "8gBm/:&EnhH.1/q"
    })

    function generateSignature(total_amount: string, transaction_uuid: string, product_code: string, secret: string) {
        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const hash = CryptoJS.HmacSHA256(message, secret);
        const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
        return (hashedSignature);
    }

    useEffect(() => {
        const hashedSignature = generateSignature(payment.total_amount, payment.transaction_uuid, payment.product_code, payment.secret)
        setPayment({ ...payment, signature: hashedSignature })
    }, [payment.total_amount, payment.transaction_uuid, payment.product_code, payment.secret])



    return (
        <div className='flex justify-center items-center h-screen'>
            <form className='flex flex-col' action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                <input type="text" id="amount" name="amount" value={payment.amount} required
                    onChange={({ target }) =>
                        setPayment({
                            ...payment,
                            amount: target.value,
                            total_amount: target.value,
                        })}
                />
                <input type="hidden" id="tax_amount" name="tax_amount" value={payment.tax_amount} required />
                <input type="hidden" id="total_amount" name="total_amount" value={payment.total_amount} required />
                <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={payment.transaction_uuid} required />
                <input type="hidden" id="product_code" name="product_code" value={payment.product_code} required />
                <input type="hidden" id="product_service_charge" name="product_service_charge" value={payment.product_service_charge} required />
                <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value={payment.product_delivery_charge} required />
                <input type="hidden" id="success_url" name="success_url" value={payment.success_url} required />
                <input type="hidden" id="failure_url" name="failure_url" value={payment.failure_url} required />
                <input type="hidden" id="signed_field_names" name="signed_field_names" value={payment.signed_field_names} required />
                <input type="hidden" id="signature" name="signature" value={payment.signature} required />
                <Button type='submit' size="lg" className="bg-green-500 text-white px-5 w-full mt-4 rounded-lg">Pay Via Esewa</Button>

            </form>
        </div>
    )
}

export default page