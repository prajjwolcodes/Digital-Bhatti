"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
    ArrowLeft, Calendar, Clock, Mail, MapPin,
    Package, UserIcon, CreditCard, Check, AlertTriangle,
    Cross,
    X
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Order, User } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"


export default function UserProfilePage() {
    const params = useParams();
    const { username } = params;
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true)

                // Fetch user data
                const userResponse = await fetch(`/api/users/profile/${username}`)

                const userData = await userResponse.json()
                console.log(userData)
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user data")
                }

                setUser(userData)

                // Fetch user orders
                const ordersResponse = await fetch("/api/orders")

                if (!ordersResponse.ok) {
                    throw new Error("Failed to fetch orders")
                }

                const ordersData = await ordersResponse.json()
                setOrders(ordersData)
            } catch (error) {
                console.error("Error fetching user data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load user data. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (status === "authenticated") {
            fetchUserData()
        } else if (status === "unauthenticated") {
            router.push("/login?callbackUrl=" + encodeURIComponent(`/profile/${username}`))
        }
    }, [username, status, router, toast])

    // Filter orders by status
    const pendingOrders = orders.filter(
        (order) => order.status === "PENDING" || order.status === "PROCCESING"
    )

    const completedOrders = orders.filter(
        (order) => order.status === "COMPLETED"
    )

    const cancelledOrders = orders.filter(
        (order) => order.status === "CANCELLED"
    )

    // Format date for display
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return format(date, "MMMM dd, yyyy");
    }

    // Format time for display
    const formatTime = (dateString: string | Date) => {
        return format(new Date(dateString), "h:mm a")
    }

    // Get status badge variant
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Pending
                    </Badge>
                )
            case "processing":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" /> Processing
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        <X className="h-3 w-3 mr-1" /> Cancelled
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Card Skeleton */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>

                        {/* Orders Skeleton */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-10 w-64 mb-6" />
                                <div className="space-y-4">
                                    <Skeleton className="h-40 w-full" />
                                    <Skeleton className="h-40 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto py-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-6">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            The user you're looking for doesn't exist or you don't have permission to view this profile.
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Get user initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    return (
        <div className="container mx-auto py-4">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1 overflow-hidden border">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={""} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">{user.name}</CardTitle>
                                    <CardDescription className="text-xs">
                                        Member since {formatDate(user.createdAt)}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-lg bg-secondary/50 p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Email</p>
                                        <p className="text-muted-foreground text-sm break-all">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="flex gap-3 mb-2">
                                            <p className="font-medium text-sm">Total Orders</p>
                                            <p className="text-muted-foreground text-sm">{orders.length}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {orders.length > 0 && (
                                                <div className="flex -space-x-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {pendingOrders.length} pending
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {completedOrders.length} completed
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {cancelledOrders.length} cancelled
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                        </CardContent>
                    </Card>

                    {/* Orders Section */}
                    <div className="md:col-span-2">
                        <Card className="shadow-sm hover:shadow transition-shadow">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-xl flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-primary" />
                                    Order History
                                </CardTitle>
                                <CardDescription>View your past and current orders</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Tabs defaultValue="pending" className="w-full">
                                    <TabsList className="mb-6 w-full justify-start space-x-2">
                                        <TabsTrigger
                                            value="pending"
                                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary relative px-4"
                                        >
                                            Pending & Processing
                                            {pendingOrders.length > 0 && (
                                                <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                                                    {pendingOrders.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="completed"
                                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                                        >
                                            Completed
                                            {completedOrders.length > 0 && (
                                                <Badge className="ml-2 bg-muted text-muted-foreground text-xs">
                                                    {completedOrders.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="cancelled"
                                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                                        >
                                            Cancelled
                                            {cancelledOrders.length > 0 && (
                                                <Badge className="ml-2 bg-muted text-muted-foreground text-xs">
                                                    {cancelledOrders.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="pending" className="space-y-6 mt-0">
                                        {pendingOrders.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-2">No pending orders</h3>
                                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                    You don't have any pending or processing orders at the moment.
                                                </p>
                                                <Button asChild>
                                                    <Link href="/#menu">Browse Menu</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            pendingOrders.map((order) => (
                                                <OrderCard
                                                    key={order.id}
                                                    order={order}
                                                    setOrders={setOrders}
                                                    formatDate={formatDate}
                                                    formatTime={formatTime}
                                                    getStatusBadge={getStatusBadge}
                                                />
                                            ))
                                        )}
                                    </TabsContent>

                                    <TabsContent value="completed" className="space-y-6 mt-0">
                                        {completedOrders.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-2">No completed orders</h3>
                                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                    You don't have any completed orders yet.
                                                </p>
                                                <Button asChild>
                                                    <Link href="/#menu">Browse Menu</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            completedOrders.map((order) => (
                                                <OrderCard
                                                    key={order.id}
                                                    order={order}
                                                    setOrders={setOrders}
                                                    formatDate={formatDate}
                                                    formatTime={formatTime}
                                                    getStatusBadge={getStatusBadge}
                                                />
                                            ))
                                        )}
                                    </TabsContent>

                                    <TabsContent value="cancelled" className="space-y-6 mt-0">
                                        {cancelledOrders.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                                                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-2">No Cancelled orders</h3>
                                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                                    You don't have any cancelled orders.
                                                </p>
                                                <Button asChild>
                                                    <Link href="/#menu">Browse Menu</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            cancelledOrders.map((order) => (
                                                <OrderCard
                                                    key={order.id}
                                                    order={order}
                                                    setOrders={setOrders}
                                                    formatDate={formatDate}
                                                    formatTime={formatTime}
                                                    getStatusBadge={getStatusBadge}
                                                />
                                            ))
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface OrderCardProps {
    order: Order
    formatDate: (date: string | Date) => string
    formatTime: (date: string | Date) => string
    getStatusBadge: (status: string) => React.ReactNode
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

function OrderCard({ order, formatDate, formatTime, getStatusBadge, setOrders }: OrderCardProps) {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const receiptRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-500 hover:bg-yellow-600"
            case "PROCCESING":
                return "bg-blue-500 hover:bg-blue-600"
            case "COMPLETED":
                return "bg-green-500 hover:bg-green-600"
            case "CANCELLED":
                return "bg-red-500 hover:bg-red-600"
            default:
                return "bg-gray-500 hover:bg-gray-600"
        }
    }

    const handleCancelOrder = async (orderId: string, newStatus: Order["status"]) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ))

        // setorder((prev) => prev && ({ ...prev, status: newStatus }))

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            const body = await res.json()
            console.log(body);


            toast({
                title: "Order Cancelled",
                description: `Order Status changed to ${newStatus}`,
                variant: "destructive"

            })

        } catch (error) {
            console.log("Error updating order status:", error)
            toast({
                title: "Error updating order status",
                description: "An error occurred while updating the order status",
            })
        }

    }

    async function generatePdf() {
        if (!contentRef.current || !order) return

        setIsGeneratingPdf(true)
        try {

            const element = contentRef.current.cloneNode(true) as HTMLElement


            const footerElement = element.querySelector('.pdf-actions-footer')
            if (footerElement) {

                footerElement.remove()
            }


            element.style.padding = '30px'
            element.style.boxSizing = 'border-box'
            element.style.backgroundColor = '#ffffff'


            element.style.position = 'absolute'
            element.style.left = '-9999px'
            document.body.appendChild(element)


            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const canvas = await html2canvas(element, {
                scale: 4,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                allowTaint: true,
                windowWidth: 1200,
            })

            document.body.removeChild(element)

            const imgData = canvas.toDataURL('image/png', 1.0)
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            const imgWidth = pageWidth - 20
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 6, 6, imgWidth, imgHeight)

            let heightLeft = imgHeight
            let position = 0

            while (heightLeft >= pageHeight - 6) {
                position = heightLeft - (pageHeight - 5)
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 5, -position + 5, imgWidth, imgHeight)
                heightLeft -= (pageHeight - 5)
            }

            pdf.save(`Invoice-${order.user.name}.pdf`)

            toast({
                title: "PDF Generated",
                description: `Invoice for order ${order.id} has been downloaded`,
            })
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast({
                title: "Error generating PDF",
                description: "An error occurred while creating the invoice PDF",
            })
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    const getOrderBorderColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "border-amber-300"
            case "processing":
                return "border-blue-300"
            case "completed":
                return "border-green-300"
            case "cancelled":
                return "border-red-300"
            default:
                return "border-gray-200"
        }
    }

    return (
        <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 ${getOrderBorderColor(order.status)}`}>
            <CardHeader className="bg-muted/40 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-base flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                            Order #{order.id}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.createdAt)}
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3" />
                            {formatTime(order.createdAt)}
                        </CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2 bg-secondary/30 p-3 rounded-md">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs bg-background">
                                        {item.quantity}
                                    </Badge>
                                    <span>{item.name}</span>
                                </div>
                                <span className="font-medium">Rs {(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Order Total */}
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-primary font-bold">Rs {Number(order.total).toFixed(2)}</span>
                    </div>

                    {/* Delivery Address if available */}
                    {order.buyer && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2 bg-muted/20 p-3 rounded-md">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground mb-1">Delivery Address</p>
                                {order.buyer.street}, {order.buyer.city}, {order.buyer.state} {order.buyer.zipCode}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4">
                {/* <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link href={`/order/${order.id}`}>
                        View Order Details
                    </Link>
                </Button> */}
                <Button onClick={() => setIsViewDialogOpen(true)} asChild variant="outline" size="sm" className="cursor-pointer w-full mt-2">
                    <h1>View Order</h1>
                </Button>
            </CardFooter>
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-5xl p-8">
                    <DialogHeader hidden aria-hidden>
                        <DialogTitle hidden>Order Details</DialogTitle>
                    </DialogHeader>
                    {order && (
                        <div id="receipt" ref={receiptRef} className="grid gap-8">
                            <div ref={contentRef} className="pdf-content grid gap-8 bg-white">
                                {/* Order Header with Status Badge */}
                                <div className="flex items-start justify-between border-b pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                                        <p className="text-gray-500">
                                            {format(order.createdAt, "MMMM dd, yyyy h:mm a")}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`${getStatusColor(order.status)} text-white px-4 py-1 mt-2 text-sm`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                </div>

                                {/* Order Content */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Customer Information */}
                                    <div className="md:col-span-1 bg-gray-50  rounded-lg">
                                        <h3 className="text-lg font-medium mb-4 border-b pb-2">Customer Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="font-medium">Name</p>
                                                <p className="text-sm ">{order.user.name}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium">Shipping Address</p>
                                                <div className="text-sm">
                                                    <p>{order.buyer?.street}</p>
                                                    <p>
                                                        {order.buyer?.city}, {order.buyer?.state} {order.buyer?.zipCode}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-medium">Specific Instruction</p>
                                                <div className="text-sm">
                                                    <p>{order.buyer?.instructions}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium mb-4 border-b pb-2">Order Items</h3>
                                        <div className="max-h-64 overflow-y-auto pr-2">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Item</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Quantity</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {order.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="font-medium">{item.name}</TableCell>
                                                            <TableCell>Rs {Number(item.price).toFixed(2)}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell className="text-right">Rs {Number(item.total).toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium mb-3 border-b pb-2">Order Summary</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal:</span>
                                                    <span>Rs {Number(order.total).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Shipping:</span>
                                                    <span>Rs 3.99</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Tax:</span>
                                                    <span>Rs {(order.total * 0.08).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium mt-3 pt-2 border-t text-lg">
                                                    <span>Total:</span>
                                                    <span>Rs {(Number(order.total) + 3.99 + Number(order.total) * 0.08).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Footer */}

                            </div>
                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                                <div className="flex items-center space-x-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
                                                <Button className="px-12" variant="destructive">Cancel</Button>
                                            )}
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will cancelled your order
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleCancelOrder(order.id, "CANCELLED")}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    {/* <Select
                                        defaultValue={order.status}
                                        onValueChange={(value) => handleCancelOrder(order.id, value as Order["status"])}
                                    >
                                        <SelectTrigger className="w-[180px] border border-gray-400">
                                            <SelectValue placeholder="Change Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PROCCESING">Processing</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        className="px-6 flex items-center gap-2"
                                        onClick={generatePdf}
                                        disabled={isGeneratingPdf}
                                    >
                                        {isGeneratingPdf ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4" />
                                                Download PDF
                                            </>
                                        )}
                                    </Button>

                                    <Button className="px-6" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                                </div>
                            </div>
                        </div>

                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}