"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, MapPin, Package, Truck, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"



export default function OrderDetailPage() {
    const params = useParams()
    const { id } = params
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Redirect if not authenticated
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=" + encodeURIComponent(`/order/${id}`))
            return
        }

        const fetchOrderData = async () => {
            try {
                setIsLoading(true)

                // Fetch order data
                const response = await fetch(`/api/orders/${id}`)

                if (!response.ok) {
                    if (response.status === 404) {
                        router.push("/404")
                        return
                    }
                    throw new Error("Failed to fetch order data")
                }

                const orderData = await response.json()
                setOrder(orderData)
            } catch (error) {
                console.error("Error fetching order data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load order data. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (status === "authenticated") {
            fetchOrderData()
        }
    }, [id, status, router, toast])

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500 hover:bg-yellow-600"
            case "processing":
                return "bg-blue-500 hover:bg-blue-600"
            case "completed":
                return "bg-green-500 hover:bg-green-600"
            case "cancelled":
                return "bg-red-500 hover:bg-red-600"
            default:
                return "bg-gray-500 hover:bg-gray-600"
        }
    }

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Package className="h-5 w-5" />
            case "processing":
                return <Truck className="h-5 w-5" />
            case "completed":
                return <Package className="h-5 w-5" />
            case "cancelled":
                return <Package className="h-5 w-5" />
            default:
                return <Package className="h-5 w-5" />
        }
    }

    // Get status description
    const getStatusDescription = (status: string) => {
        switch (status) {
            case "pending":
                return "Your order has been received and is being prepared."
            case "processing":
                return "Your order is on its way to you."
            case "completed":
                return "Your order has been delivered successfully."
            case "cancelled":
                return "This order has been cancelled."
            default:
                return "Status information unavailable."
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                    <p className="text-muted-foreground mb-6">
                        The order you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button asChild>
                        <Link href="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/user/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                                        <span className="mx-1">•</span>
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(order.createdAt), "h:mm a")}
                                    </CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status */}
                            <div className="bg-muted/40 p-4 rounded-lg flex items-start gap-4">
                                <div className={`${getStatusColor(order.status)} text-white p-2 rounded-full`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <h3 className="font-medium">Order {order.status}</h3>
                                    <p className="text-muted-foreground">{getStatusDescription(order.status)}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-medium mb-3">Order Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                                                {/* <Image
                          src={item.foodItem?.image || "/placeholder.svg?height=100&width=100"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        /> */}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Rs {Number(item.price).toFixed(2)} × {item.quantity}
                                                </div>
                                            </div>
                                            <div className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            {order.buyer && (
                                <div>
                                    <h3 className="font-medium mb-3">Delivery buyer</h3>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                        <div>
                                            {order.buyer.street && <div>{order.buyer.street}</div>}
                                            {/* {order.buyer.apartment && <div>{order.buyer.apartment}</div>} */}
                                            {order.buyer.city && order.buyer.state && order.buyer.zipCode && (
                                                <div>
                                                    {order.buyer.city}, {order.buyer.state} {order.buyer.zipCode}
                                                </div>
                                            )}
                                            {order.buyer.instructions && (
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    <span className="font-medium">Instructions:</span> {order.buyer.instructions}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>
                                            {item.quantity} × {item.name}
                                        </span>
                                        <span>Rs {(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs {Number(order.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>Rs 3.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>Rs {(Number(order.total) * 0.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-medium text-lg">
                                <span>Total</span>
                                <span>Rs {(Number(order.total) + 3.99 + Number(order.total) * 0.08).toFixed(2)}</span>
                            </div>

                            {/* Customer Info */}
                            {order.user && (
                                <div className="mt-6 pt-4 border-t">
                                    <h3 className="font-medium mb-3">Customer</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{order.user.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/#menu">Order Again</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

