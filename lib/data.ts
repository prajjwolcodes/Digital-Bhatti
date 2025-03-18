import prisma from "@/lib/prisma"
import type { FoodItem } from "./types"

export async function getFoodItems(): Promise<FoodItem[]> {
  try {
    const foodItems = await prisma.foodItem.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Transform Prisma model to match FoodItem type
    return foodItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category.name,
      image: item.image || undefined,
      ingredients: item.ingredients,
      nutritionalInfo: item.nutritionalInfo as any,
    }))
  } catch (error) {
    console.error("Error fetching food items:", error)

    // Fallback to mock data if database is not available
    return [
      {
        id: "1",
        name: "Classic Burger",
        description:
          "Juicy beef patty with lettuce, tomato, and our special sauce on a toasted brioche bun. Served with a side of crispy fries.",
        price: 12.99,
        category: "Main Courses",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Beef patty", "Lettuce", "Tomato", "Onion", "Brioche bun", "Special sauce"],
        nutritionalInfo: {
          calories: "650 kcal",
          protein: "35g",
          carbs: "48g",
          fat: "32g",
        },
      },
      {
        id: "2",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with our homemade Caesar dressing, croutons, and shaved parmesan cheese.",
        price: 8.99,
        category: "Appetizers",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Romaine lettuce", "Caesar dressing", "Croutons", "Parmesan cheese"],
        nutritionalInfo: {
          calories: "320 kcal",
          protein: "12g",
          carbs: "15g",
          fat: "24g",
        },
      },
      {
        id: "3",
        name: "Chocolate Cake",
        description: "Rich chocolate cake with a layer of ganache and a scoop of vanilla ice cream.",
        price: 6.99,
        category: "Desserts",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter", "Vanilla ice cream"],
        nutritionalInfo: {
          calories: "450 kcal",
          protein: "6g",
          carbs: "65g",
          fat: "18g",
        },
      },
      {
        id: "4",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, fresh mozzarella, and basil on a thin crust.",
        price: 14.99,
        category: "Main Courses",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Pizza dough", "Tomato sauce", "Fresh mozzarella", "Basil", "Olive oil"],
        nutritionalInfo: {
          calories: "780 kcal",
          protein: "28g",
          carbs: "92g",
          fat: "32g",
        },
      },
      {
        id: "5",
        name: "Chicken Wings",
        description: "Crispy chicken wings tossed in your choice of sauce: Buffalo, BBQ, or Honey Garlic.",
        price: 10.99,
        category: "Appetizers",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Chicken wings", "Choice of sauce", "Celery sticks", "Blue cheese dip"],
        nutritionalInfo: {
          calories: "580 kcal",
          protein: "42g",
          carbs: "12g",
          fat: "38g",
        },
      },
      {
        id: "6",
        name: "Cheesecake",
        description: "Creamy New York style cheesecake with a graham cracker crust and berry compote.",
        price: 7.99,
        category: "Desserts",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Cream cheese", "Sugar", "Eggs", "Graham crackers", "Butter", "Mixed berries"],
        nutritionalInfo: {
          calories: "420 kcal",
          protein: "8g",
          carbs: "38g",
          fat: "26g",
        },
      },
      {
        id: "7",
        name: "Iced Coffee",
        description: "Cold brewed coffee served over ice with your choice of milk and sweetener.",
        price: 4.99,
        category: "Beverages",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Cold brew coffee", "Ice", "Choice of milk", "Optional sweetener"],
        nutritionalInfo: {
          calories: "120 kcal",
          protein: "2g",
          carbs: "18g",
          fat: "4g",
        },
      },
      {
        id: "8",
        name: "French Fries",
        description: "Crispy golden fries seasoned with sea salt. Served with ketchup.",
        price: 3.99,
        category: "Sides",
        image: "/placeholder.svg?height=400&width=400",
        ingredients: ["Potatoes", "Vegetable oil", "Sea salt"],
        nutritionalInfo: {
          calories: "380 kcal",
          protein: "4g",
          carbs: "48g",
          fat: "19g",
        },
      },
    ]
  }
}

export async function getFoodItem(id: string): Promise<FoodItem | undefined> {
  try {
    const item = await prisma.foodItem.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    if (!item) return undefined

    // Transform Prisma model to match FoodItem type
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category.name,
      image: item.image || undefined,
      ingredients: item.ingredients,
      nutritionalInfo: item.nutritionalInfo as any,
    }
  } catch (error) {
    console.error("Error fetching food item:", error)

    // Fallback to mock data if database is not available
    const mockItems = await getFoodItems()
    return mockItems.find((item) => item.id === id)
  }
}

export async function getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
  try {
    // First, find the category ID
    const categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
      },
    })

    if (!categoryRecord) return []

    const foodItems = await prisma.foodItem.findMany({
      where: {
        categoryId: categoryRecord.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Transform Prisma model to match FoodItem type
    return foodItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category.name,
      image: item.image || undefined,
      ingredients: item.ingredients,
      nutritionalInfo: item.nutritionalInfo as any,
    }))
  } catch (error) {
    console.error("Error fetching food items by category:", error)

    // Fallback to mock data if database is not available
    const mockItems = await getFoodItems()
    return mockItems.filter((item) => item.category === category)
  }
}

export const mockShopDetails = [{
  name: "Mock Hotel",
  address: "1234 Food Street, Food City",
  phone: "+123 456 7890",
  email: "hotel@gmail.com",
  facebook: "https://www.facebook.com",
  instagram: "https://www.instagram.com",
  twitter: "https://www.twitter.com"
}]

