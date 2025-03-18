export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  ingredients?: string[]
  nutritionalInfo?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
    [key: string]: string | undefined
  }
}

export interface adminFoodItem {
  id: string
  name: string
  description: string
  price: number
  category: {
    id: string
    name: string
    description?: string
  }
  image?: string
  ingredients?: string[]
  nutritionalInfo?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
    [key: string]: string | undefined
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: Date
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface OrderItem {
  id: string
  foodItemId: string
  name: string
  price: number
  quantity: number
  total: number
}

export interface Category {
  id: string
  name: string
  description?: string
}

import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string,
    name: string,
    email: string,
    role: string,

  }

  interface Session {
    user: {
      id: string,
      name: string,
      email: string,
      role: string,
    } & DefaultSession['user']

  }
}
