// pages/payment-failure.js
import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <XCircle className="h-16 w-16 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6">
                    We're sorry, but your payment could not be processed. Please check your payment details
                    and try again, or contact our support team for assistance.
                </p>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col space-y-3">
                        <Link href="/checkout" className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            Try Again
                        </Link>
                        <Link href="/" className="inline-flex items-center justify-center bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            Return to Home
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center bg-white text-gray-600 hover:bg-gray-50 font-medium py-3 px-4 rounded-md transition-colors duration-200">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}