"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { FoodItem } from "@/lib/types"

interface AddToCartButtonProps {
  item: FoodItem
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(item, quantity)
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 500)
  }

  return (
    <div className="flex gap-4 justify-center items-center">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-4 text-xl font-medium w-8 text-center">{quantity}</span>
        <Button variant="outline" size="icon" onClick={increaseQuantity}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isAdding}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isAdding ? "Added to Cart!" : `Add to Cart - Rs ${(item.price * quantity).toFixed(2)}`}
      </Button>
    </div>
  )
}

