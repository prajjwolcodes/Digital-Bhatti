"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleCheckout = () => {
    if (!session || !session.user) {
      toast({
        title: "Login first",
        description: "Please login before checking out",
        variant: "destructive",
      })
      return router.replace("/auth/login")
    }
    if (totalItems === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
                  <Button asChild>
                    <Link href="/">Browse Menu</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || `/placeholder.svg?height=200&width=200`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <Link href={`/food/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">Rs {item.price.toFixed(2)} each</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right w-20 font-medium">Rs {(item.price * item.quantity).toFixed(2)}</div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{totalPrice > 0 ? "Rs 3.99" : "Rs 0.00"}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs {totalPrice > 0 ? (totalPrice * 0.08).toFixed(2) : "0.00"}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>Rs {totalPrice > 0 ? (totalPrice + 3.99 + totalPrice * 0.08).toFixed(2) : "0.00"}</span>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={items.length === 0}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

