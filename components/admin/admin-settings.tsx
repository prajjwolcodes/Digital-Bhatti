"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    })
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

          <TabsContent value="general">
            <form onSubmit={handleSaveSettings}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input id="restaurant-name" defaultValue="FoodApp" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="contact@foodapp.com" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue="(123) 456-7890" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue="123 Main St, Anytown, CA 12345" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="business-hours">Business Hours</Label>
                  <Textarea
                    id="business-hours"
                    defaultValue="Monday - Friday: 9:00 AM - 10:00 PM&#10;Saturday - Sunday: 10:00 AM - 11:00 PM"
                  />
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
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

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

