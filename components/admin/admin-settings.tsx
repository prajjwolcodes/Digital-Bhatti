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
import { set } from "date-fns"

export default function AdminSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  const [shopData, setShopData] = useState(mockShopDetails)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchShopData() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings')
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
    // Save settings logic here
    try {
      const formData = new FormData(e.currentTarget)
      const updatedShopDetails = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        instagram: formData.get("instagram") as string,
        facebook: formData.get("facebook") as string,
        address: formData.get("address") as string,
        twitter: formData.get("twitter") as string,
      }

      // console.log(updatedShopDetails)

      const res = await fetch("api/settings", {
        method: "PUT",
        body: JSON.stringify(updatedShopDetails),
        headers: {
          "Content-Type": "application/json",
        }
      })
      // const data = await res.json()
      // console.log(data)
      setShopData([updatedShopDetails])

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving your settings",
      })
      setShopData(mockShopDetails)

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
          )}

          <TabsContent value="notifications">
            <form onSubmit={handleSaveSettings}>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-notifications">Order Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications for new orders</div>
                  </div>
                  <Switch id="order-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-notifications">User Registrations</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications for new user registrations
                    </div>
                  </div>
                  <Switch id="user-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="review-notifications">Reviews</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications for new reviews</div>
                  </div>
                  <Switch id="review-notifications" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input id="notification-email" type="email" defaultValue="notifications@foodapp.com" />
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

          <TabsContent value="payment">
            <form onSubmit={handleSaveSettings}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="USD" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tax-enabled">Enable Tax</Label>
                    <div className="text-sm text-muted-foreground">Apply tax to orders</div>
                  </div>
                  <Switch id="tax-enabled" defaultChecked />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="8" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="delivery-fee-enabled">Enable Delivery Fee</Label>
                    <div className="text-sm text-muted-foreground">Apply delivery fee to orders</div>
                  </div>
                  <Switch id="delivery-fee-enabled" defaultChecked />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="delivery-fee">Delivery Fee ($)</Label>
                  <Input id="delivery-fee" type="number" step="0.01" defaultValue="3.99" />
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

          <TabsContent value="appearance">
            <form onSubmit={handleSaveSettings}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" defaultValue="/logo.png" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input id="favicon" defaultValue="/favicon.ico" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input id="primary-color" defaultValue="#0f172a" />
                    <div className="w-10 h-10 rounded-md bg-primary" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">Enable dark mode by default</div>
                  </div>
                  <Switch id="dark-mode" />
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
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
      </CardFooter>
    </Card>
  )
}

