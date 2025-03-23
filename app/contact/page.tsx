"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import Map from "@/components/Map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            toast({
                title: "Message sent!",
                description: "We've received your message and will get back to you soon.",
            })
            setIsSubmitting(false)

            // Reset form
            const form = e.target as HTMLFormElement
            form.reset()
        }, 1500)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="mb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Get in Touch</h1>
                    <p className="text-lg mx-auto  text-muted-foreground">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Form */}
            <section className="mb-20 ">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Send a Message</CardTitle>
                            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action="https://getform.io/f/lbkmyxmb" method="POST" className="space-y-6 text-gray-800">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input id="first-name" name="first-name" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input id="last-name" name="last-name" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (optional)</Label>
                                    <Input id="phone" name="phone" type="tel" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select name="subject" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Inquiry</SelectItem>
                                            <SelectItem value="support">Customer Support</SelectItem>
                                            <SelectItem value="feedback">Feedback</SelectItem>
                                            <SelectItem value="partnership">Partnership</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="How can we help you?"
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>How did you hear about us?</Label>
                                    <RadioGroup defaultValue="social-media">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="social-media" id="social-media" />
                                            <Label htmlFor="social-media">Social Media</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="search" id="search" />
                                            <Label htmlFor="search">Search Engine</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="friend" id="friend" />
                                            <Label htmlFor="friend">Friend/Family</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="other" id="other" />
                                            <Label htmlFor="other">Other</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                                <CardDescription>Find quick answers to common questions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-1">What are your delivery hours?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We deliver from 10:00 AM to 10:00 PM, seven days a week.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">How long does delivery take?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Delivery times typically range from 30-45 minutes, depending on your location and order volume.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">Do you offer catering services?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Yes! We offer catering for events of all sizes. Please contact us at least 48 hours in advance.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">How can I track my order?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Once your order is confirmed, you'll receive a tracking link via email and SMS.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We accept all major credit cards, PayPal, and cash on delivery.
                                    </p>
                                </div>


                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section>
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h2 className="text-4xl font-bold mb-3">Find Us</h2>
                    <p className="text-xl text-muted-foreground">Visit our location to experience our food in person</p>
                </div>

                {/* This would be replaced with an actual map component in production */}
                {/* <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium">123 Food Street, Foodville</p>
                            <p className="text-muted-foreground">Interactive map would be displayed here</p> */}
                <Map />
            </section>
        </div>
    )
}

