"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { mockShopDetails } from "@/lib/data"

export default function AdminSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [shopData, setShopData] = useState(mockShopDetails)
  const [formState, setFormState] = useState({
    deliveryEnabled: shopData[0]?.deliveryEnabled || false,
  })
  const [isLoading, setIsLoading] = useState(false)

  async function fetchShopData() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error("Failed to fetch shop data")
      const data = await res.json()
      setShopData(data)
    } catch (error) {
      console.error("Error fetching shop data:", error)
      setShopData(mockShopDetails)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShopData()
  }, [])

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      let updatedData: { tabType?: string; name?: string; email?: string; phone?: string; instagram?: string; facebook?: string; twitter?: string; address?: string; taxRate?: number; deliveryEnabled?: boolean; deliveryCharge?: number } = {}

      if (activeTab === "general") {
        updatedData = {
          tabType: "general",
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          instagram: formData.get("instagram") as string,
          facebook: formData.get("facebook") as string,
          twitter: formData.get("twitter") as string,
          address: formData.get("address") as string,
        }
      } else if (activeTab === "payment") {
        const deliveryEnabled = formState.deliveryEnabled
        const taxRate = formData.get("tax-rate")
        const deliveryCharge = formData.get("delivery-fee")

        updatedData = {
          tabType: "payment",
          taxRate: taxRate ? parseFloat(taxRate as string) : 0,
          deliveryEnabled: deliveryEnabled,
        }

        console.log(updatedData)

        if (deliveryEnabled && deliveryCharge) {
          updatedData.deliveryCharge = parseFloat(deliveryCharge as string)
        }
      } else if (activeTab === "notifications") {
        updatedData = {
          tabType: "notifications",
          // Add notification fields here
        }
      } else if (activeTab === "appearance") {
        updatedData = {
          tabType: "appearance",
          // Add appearance fields here
        }
      }

      const res = await fetch("api/settings", {
        method: "PATCH",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        }
      })

      console.log(await res.json())

      if (!res.ok) throw new Error("Failed to update settings")

      setShopData(prevData => {
        const newData = [...prevData]
        const { tabType, ...dataToUpdate } = updatedData
        newData[0] = { ...newData[0], ...dataToUpdate }
        return newData
      })

      toast({
        title: "Settings saved",
        description: `Your ${activeTab} settings have been saved successfully`,
      })
    } catch (error) {
      console.error(`Error saving ${activeTab} settings:`, error)
      toast({
        title: "Error",
        description: `An error occurred while saving your ${activeTab} settings`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your application settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TabsContent value="general">
                <form onSubmit={handleSaveSettings}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input id="restaurant-name" name="name" defaultValue={shopData[0].name} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" name="email" defaultValue={shopData[0].email} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" name="phone" defaultValue={shopData[0].phone} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-facebook">Contact Facebook</Label>
                      <Input id="contact-facebook" name="facebook" defaultValue={shopData[0].facebook} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-instagram">Contact Instagram</Label>
                      <Input id="contact-instagram" name="instagram" defaultValue={shopData[0].instagram} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-twitter">Contact Twitter</Label>
                      <Input id="contact-twitter" name="twitter" defaultValue={shopData[0].twitter} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" name="address" defaultValue={shopData[0].address} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <div className="text-sm text-muted-foreground">Put the website in maintenance mode</div>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isLoading ? "Saving...." : " Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="payment">
                <form onSubmit={handleSaveSettings}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input id="currency" defaultValue="Nep" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" name="tax-rate" defaultValue={shopData[0].taxRate} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="delivery-fee-enabled">Enable Delivery Fee</Label>
                        <div className="text-sm text-muted-foreground">Apply delivery fee to orders</div>
                      </div>
                      <Switch
                        id="delivery-fee-enabled"
                        checked={formState.deliveryEnabled}
                        onCheckedChange={(checked) => {
                          setFormState(prev => ({ ...prev, deliveryEnabled: checked }))
                        }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="delivery-fee">Delivery Fee</Label>
                      <Input
                        id="delivery-fee"
                        name="delivery-fee"
                        defaultValue={shopData[0].deliveryCharge}
                        disabled={!formState.deliveryEnabled}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Add other tabs content here */}
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
      </CardFooter>
    </Card>
  )
}