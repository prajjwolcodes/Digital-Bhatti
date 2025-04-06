'use client'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EsewaPayment from "@/app/payment/esewa/EsewaPayment"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TruckIcon, Loader2 } from "lucide-react"
import { useParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const PaymentPage = () => {
    const orderId = useParams().orderid
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    async function fetchOrderDetails() {
        try {
            setLoading(true)
            const response = await fetch(`/api/orders/${orderId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch order details')
            }
            const data = await response.json()
            setTotal(data.total.toNumber())
            return data
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [orderId])

    function handleConfirmOrder() {
        toast({
            title: "Order placed successfully!",
            description: "Thank you for your order. You will receive a confirmation email shortly.",
        })

        router.push("/")
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] mb-32">
                <Card className="w-full max-w-lg shadow-lg">
                    <CardHeader className="bg-slate-50 rounded-t-lg">
                        <CardTitle className="flex items-center justify-center text-center text-xl font-medium">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Preparing Payment...
                        </CardTitle>
                        <CardDescription className="text-center">
                            Your order details are being loaded
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="w-full max-w-lg mx-auto shadow-lg mb-16">
                <CardHeader className="bg-red-50 rounded-t-lg">
                    <CardTitle className="text-red-700">Error Loading Payment</CardTitle>
                    <CardDescription className="text-red-600">{error}</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="max-w-lg mx-auto py-8 px-4 mb-32">
            <Navbar />
            <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-slate-50 rounded-t-lg border-b pb-6">
                    <CardTitle className="text-2xl font-semibold text-slate-800">
                        Payment Method
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                        Select how you'd like to pay for your order
                    </CardDescription>

                    <div className="mt-4 bg-blue-50 p-3 rounded-md flex items-center">
                        <div className="text-blue-800 font-medium">
                            Order Total: <span className="ml-1 text-lg font-bold">${Number(total).toFixed(2)}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <Tabs defaultValue="online" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
                            <TabsTrigger value="online" className="py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="font-medium">Online Payment</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="cash" className="py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <TruckIcon className="h-4 w-4" />
                                    <span className="font-medium">Cash on Delivery</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="online" className="mt-2">
                            <div className="bg-slate-50 p-4 rounded-md mb-4">
                                <h3 className="font-medium text-slate-800 mb-2">Secure Online Payment</h3>
                                <p className="text-slate-600 text-sm">Pay now using our secure payment gateway</p>
                            </div>
                            <div className="py-2">
                                <EsewaPayment total_amount={Number(Number(total).toFixed(2))} orderId={orderId} />
                            </div>
                        </TabsContent>

                        <TabsContent value="cash" className="mt-2">
                            <div className="bg-slate-50 p-4 rounded-md">
                                <h3 className="font-medium text-slate-800 mb-2">Cash on Delivery</h3>
                                <p className="text-slate-600 text-sm">Your previously submitted delivery details will be used</p>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                                <p className="text-green-800 text-sm">
                                    Pay with cash when your order is delivered to your doorstep.
                                </p>

                                <button onClick={handleConfirmOrder}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition-colors"
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="border-t bg-slate-50 p-4 text-xs text-slate-500 rounded-b-lg">
                    <p>Your payment information is processed securely. We do not store credit card details.</p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PaymentPage