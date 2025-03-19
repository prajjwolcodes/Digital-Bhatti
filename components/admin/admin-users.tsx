"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

// Mock data for demonstration
const mockUsers: (User & { orders: number })[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "USER",
    createdAt: new Date(2023, 2, 15),
    orders: 5,
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "USER",
    createdAt: new Date(2023, 3, 20),
    orders: 3,
  },
  {
    id: "user-3",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    createdAt: new Date(2023, 1, 10),
    orders: 0,
  },
  {
    id: "user-4",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "USER",
    createdAt: new Date(2023, 4, 5),
    orders: 8,
  },
]

export default function AdminUsers({ onUserAdd }: { onUserAdd: () => void }) {
  const { toast } = useToast()
  const [users, setUsers] = useState<(User & { orders: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<(User & { orders: number }) | null>(null)

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Failed to load users",
          description: "Please try again later",
          variant: "destructive",
        })
        // Fall back to mock data if API fails
        setUsers(mockUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentUser) return

    const formData = new FormData(e.currentTarget)
    setIsLoadingButton(true)

    try {
      const updatedUser = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as "USER" | "ADMIN",
      }



      // Send the data to the API
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update user")
      }

      const savedUser = await response.json()

      // Update the UI
      setUsers(users.map((user) => (user.id === currentUser.id ? { ...savedUser, orders: currentUser.orders } : user)))

      setIsEditDialogOpen(false)
      setCurrentUser(null)

      toast({
        title: "User updated",
        description: `${savedUser.name}'s information has been updated`,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Failed to update user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoadingButton(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!currentUser) return

    try {
      // Send the delete request to the API
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete user")
      }

      // Update the UI
      onUserAdd()
      setUsers(users.filter((user) => user.id !== currentUser.id))
      setIsDeleteDialogOpen(false)
      setCurrentUser(null)

      toast({
        title: "User deleted",
        description: `${currentUser.name}'s account has been removed`,
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (user: User & { orders: number }) => {
    setCurrentUser(user)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User & { orders: number }) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts</CardDescription>
      </CardHeader>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{user.orders}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Make changes to the user account. Click save when you're done.</DialogDescription>
              </DialogHeader>
              {currentUser && (
                <form onSubmit={handleEditUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" name="name" defaultValue={currentUser.name} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input id="edit-email" name="email" type="email" defaultValue={currentUser.email} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select name="role" defaultValue={currentUser.role}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {isLoadingButton ? "Saving..."
                        : "Save Changes"} </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      )}
    </Card>
  )
}

