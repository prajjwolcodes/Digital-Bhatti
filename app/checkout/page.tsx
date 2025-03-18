"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { createOrder } from "./actions"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get form data
      const formData = new FormData(e.currentTarget)

      // Add cart items to form data
      formData.append("cartItems", JSON.stringify(items))

      // Submit order
      const result = await createOrder(formData)

      if (result.success) {
        clearCart()

        toast({
          title: "Order placed successfully!",
          description: "Thank you for your order. You will receive a confirmation email shortly.",
        })

        router.push("/order-confirmation")
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Checkout error:", error)

      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = totalPrice
  const deliveryFee = 3.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} id="checkout-form">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>We'll use this information to contact you about your order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" name="first-name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" name="last-name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                  <CardDescription>Enter the address where you'd like your order delivered.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" name="apartment" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-instructions">Delivery Instructions (optional)</Label>
                    <Input
                      id="delivery-instructions"
                      name="delivery-instructions"
                      placeholder="E.g., Gate code, landmark, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select a payment method for your order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="card" name="payment-method">
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" name="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" name="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" name="cvc" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" name="name-on-card" required />
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>Rs {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs {tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs {total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs {tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

