"use client"

import { useState } from "react"
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
    status: "completed",
    createdAt: new Date(2023, 5, 15, 12, 30),
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
  },
  {
    id: "ORD-002",
    userId: "user-2",
    items: [
      {
        id: "item-3",
        foodItemId: "4",
        name: "Margherita Pizza",
        price: 14.99,
        quantity: 1,
        total: 14.99,
      },
    ],
    total: 14.99,
    status: "processing",
    createdAt: new Date(2023, 5, 16, 18, 45),
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
      country: "USA",
    },
  },
  {
    id: "ORD-003",
    userId: "user-3",
    items: [
      {
        id: "item-4",
        foodItemId: "3",
        name: "Chocolate Cake",
        price: 6.99,
        quantity: 2,
        total: 13.98,
      },
      {
        id: "item-5",
        foodItemId: "7",
        name: "Iced Coffee",
        price: 4.99,
        quantity: 2,
        total: 9.98,
      },
    ],
    total: 23.96,
    status: "pending",
    createdAt: new Date(2023, 5, 17, 9, 15),
    address: {
      street: "789 Pine St",
      city: "Elsewhere",
      state: "TX",
      zipCode: "54321",
      country: "USA",
    },
  },
]

export default function AdminOrders() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const getStatusColor = (status: Order["status"]) => {
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

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

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
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{format(order.createdAt, "MMM dd, yyyy")}</TableCell>
                <TableCell>User {order.userId.split("-")[1]}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Order Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder &&
                  `Order ID: ${selectedOrder.id} - ${format(selectedOrder.createdAt, "MMMM dd, yyyy h:mm a")}`}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                    <p>User ID: {selectedOrder.userId}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-1">Shipping Address</h4>
                      <p>{selectedOrder.address?.street}</p>
                      <p>
                        {selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.zipCode}
                      </p>
                      <p>{selectedOrder.address?.country}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                    <div className="flex justify-between mb-1">
                      <span>Status:</span>
                      <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} text-white`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Shipping:</span>
                      <span>$3.99</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Tax:</span>
                      <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>${(selectedOrder.total + 3.99 + selectedOrder.total * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
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
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between">
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order["status"])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

