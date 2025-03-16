"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { FoodItem } from "@/lib/types"
import { useEffect } from "react"

// Mock data for demonstration
const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    category: { id: "1", name: "Main Courses" },
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 7.99,
    category: { id: "2", name: "Appetizers" },
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with a layer of ganache",
    price: 5.99,
    category: { id: "3", name: "Desserts" },
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Mock categories for demonstration
const mockCategories = ["Appetizers", "Main Courses", "Desserts", "Beverages", "Sides"]

export default function AdminFoodItems() {
  const { toast } = useToast()
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fall back to mock categories if API fails
      }
    }

    fetchCategories()
  }, [])

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      // Prepare the data
      const newItem = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        categoryId: formData.get("category") as string,
        image: "/placeholder.svg?height=200&width=200", // Default placeholder
        ingredients: [], // Can be enhanced to accept ingredients
        nutritionalInfo: {}, // Can be enhanced to accept nutritional info
      }

      // Send the data to the API
      const response = await fetch("/api/food-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add food item")
      }

      const savedItem = await response.json()

      // Update the UI
      setFoodItems([...foodItems, savedItem])
      setIsAddDialogOpen(false)

      toast({
        title: "Food item added",
        description: `${savedItem.name} has been added to the menu`,
      })
    } catch (error) {
      console.error("Error adding food item:", error)
      toast({
        title: "Failed to add food item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/food-items")

        if (!response.ok) {
          throw new Error("Failed to fetch food items")
        }

        const data = await response.json()
        setFoodItems(data)
      } catch (error) {
        console.error("Error fetching food items:", error)
        toast({
          title: "Failed to load food items",
          description: "Please try again later",
          variant: "destructive",
        })
        // Fall back to mock data if API fails
        setFoodItems(mockFoodItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoodItems()
  }, [toast])

  const handleEditItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentItem) return

    const formData = new FormData(e.currentTarget)

    try {
      const updatedItem = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        categoryId: formData.get("category") as string,
        image: currentItem.image,
      }

      const response = await fetch(`/api/food-items/${currentItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update food item")
      }

      const savedItem = await response.json()

      // Update the UI
      setFoodItems(foodItems.map((item) => (item.id === currentItem.id ? savedItem : item)))
      setIsEditDialogOpen(false)
      setCurrentItem(null)

      toast({
        title: "Food item updated",
        description: `${savedItem.name} has been updated`,
      })
    } catch (error) {
      console.error("Error updating food item:", error)
      toast({
        title: "Failed to update food item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async () => {
    if (!currentItem) return

    try {
      const response = await fetch(`/api/food-items/${currentItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete food item")
      }

      // Update the UI
      setFoodItems(foodItems.filter((item) => item.id !== currentItem.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Food item deleted",
        description: `${currentItem.name} has been removed from the menu`,
      })

      setCurrentItem(null)
    } catch (error) {
      console.error("Error deleting food item:", error)
      toast({
        title: "Failed to delete food item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: FoodItem) => {
    setCurrentItem(item)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (item: FoodItem) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Food Items</CardTitle>
          <CardDescription>Manage your menu items</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Food Item</DialogTitle>
              <DialogDescription>Add a new item to your menu. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={categories.length > 0 ? categories[0].id : ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0
                        ? categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                        : mockCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" placeholder="Upload image functionality would be here" disabled />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category?.name}</TableCell>
                  <TableCell>
                    ${typeof item.price === "number" ? item.price.toFixed(2) : Number(item.price).toFixed(2)}
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
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(item)}
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
                <DialogTitle>Edit Food Item</DialogTitle>
                <DialogDescription>Make changes to the food item. Click save when you're done.</DialogDescription>
              </DialogHeader>
              {currentItem && (
                <form onSubmit={handleEditItem}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" name="name" defaultValue={currentItem.name} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        name="description"
                        defaultValue={currentItem.description}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price">Price ($)</Label>
                      <Input
                        id="edit-price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={currentItem.price}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        name="category"
                        defaultValue={currentItem.category?.id || categories[0]?.id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0
                            ? categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                            : mockCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
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
                  Are you sure you want to delete this food item? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteItem}>
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

