// pages/payment-success.js
import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
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
                    A confirmation email has been sent to your registered email address.
                </p>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col space-y-3">
                        <Link href="/" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            Return to Home
                        </Link>
                        <Link href="/orders" className="inline-flex items-center justify-center bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            View My Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}