"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-1",
    items: [
      {
        id: "item-1",
        foodItemId: "1",
        name: "Classic Burger",
        price: 12.99,
        quantity: 2,
        total: 25.98,
      },
      {
        id: "item-2",
        foodItemId: "8",
        name: "French Fries",
        price: 3.99,
        quantity: 1,
        total: 3.99,
      },
    ],
    total: 29.97,
    status: "COMPLETED",
    createdAt: new Date(2023, 5, 15, 12, 30),
    buyer: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john@gmail.com"
    }

  },

]

export default function AdminOrders() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    setSelectedOrder((prev) => prev && ({ ...prev, status: newStatus }))


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
        title: "Order status updated",
        description: `Order Status changed to ${newStatus}`,
      })

    } catch (error) {
      console.log("Error updating order status:", error)
      toast({
        title: "Error updating order status",
        description: "An error occurred while updating the order status",
      })
    }

  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  async function fetchOrders() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      console.log(data)
      setOrders(data)
    } catch (error) {
      console.log("Error fetching orders:", error)
      setOrders(mockOrders)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : <>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.user.name}</TableCell>
                  <TableCell>{format(order.createdAt, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>Rs {Number(order.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-full border-none p-0 h-auto shadow-none">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="PROCESSING">Processing</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </>}
          </TableBody>

        </Table>





        {/* Order Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-5xl p-6">
            <DialogHeader hidden aria-hidden>
              <DialogTitle hidden>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid gap-8">
                {/* Order Header with Status Badge */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                    <p className="text-gray-500">
                      {format(selectedOrder.createdAt, "MMMM dd, yyyy h:mm a")}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} text-white px-4 py-1 text-sm`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>

                {/* Order Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Information */}
                  <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Customer Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-sm ">{selectedOrder.user.name}</p>
                      </div>

                      <div>
                        <p className="font-medium">Shipping Address</p>
                        <div className="text-sm">
                          <p>{selectedOrder.buyer?.street}</p>
                          <p>
                            {selectedOrder.buyer?.city}, {selectedOrder.buyer?.state} {selectedOrder.buyer?.zipCode}
                          </p>
                          <p>{selectedOrder.buyer?.country}</p>
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
                          {selectedOrder.items.map((item) => (
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
                          <span>Rs {Number(selectedOrder.total).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>Rs 3.99</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>Rs {(selectedOrder.total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-3 pt-2 border-t text-lg">
                          <span>Total:</span>
                          <span>Rs {(Number(selectedOrder.total) + 3.99 + Number(selectedOrder.total) * 0.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Update Status:</span>
                    <Select
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order["status"])}
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
                    </Select>
                  </div>

                  <Button className="px-6" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

