"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import type { FoodItem } from "@/lib/types"

interface FoodCardProps {
  item: FoodItem
}

export default function FoodCard({ item }: FoodCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(item)
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Link href={`/food/${item.id}`}>
          <Image
            src={item.image || `/placeholder.svg?height=400&width=400`}
            alt={item.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </Link>
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/food/${item.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg">{item.name}</h3>
          </Link>
          <div className="font-medium text-primary">${item.price.toFixed(2)}</div>
        </div>
        <p className="text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full" disabled={isAdding}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Added!" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}

