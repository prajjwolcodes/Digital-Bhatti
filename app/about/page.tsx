import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, Clock, MapPin, Phone, Star, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 mb-20">
            {/* Hero Section with Diagonal Split */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 -skew-y-3 transform origin-top-right z-0"></div>
                <div className="container mx-auto px-4 py-24 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 max-w-xl">
                            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/20 text-primary rounded-full">Est. 2023</span>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                                About <span className="text-primary">Food</span>App
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Delivering delicious meals to your doorstep since 2023. We're passionate about great food and exceptional service.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    <Link href="/menu" className="flex items-center">
                                        Explore Our Menu <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-full border-2 hover:bg-primary/5">
                                    <Link href="/contact">Contact Us</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full"></div>
                            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300">
                                <Image
                                    src="/placeholder.svg?height=800&width=600"
                                    alt="Restaurant interior"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section with Staggered Layout */}
            <section className="py-24 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 relative">
                    {/* <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-9xl font-bold text-primary/5">Story</span> */}
                    <h2 className="text-4xl font-bold mb-4 relative">Our Story</h2>
                    <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
                    <p className="text-xl text-muted-foreground">
                        FoodApp was founded with a simple mission: to make delicious food accessible to everyone, everywhere.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full"></div>
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl transform transition-all duration-300">
                                <Image
                                    src="/placeholder.svg?height=1000&width=800"
                                    alt="Chef preparing food"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-7 space-y-6 md:pl-12 order-1 md:order-2">
                        <h3 className="text-3xl font-bold text-primary">From Passion to Plate</h3>
                        <div className="prose prose-lg">
                            <p>
                                Our journey began in a small kitchen with big dreams. What started as a passion project quickly grew into
                                a beloved food delivery service trusted by thousands of customers.
                            </p>
                            <p>
                                We partner with the best local restaurants and chefs to bring you a diverse menu of high-quality dishes.
                                Our team of dedicated delivery drivers ensures your food arrives hot and fresh, just as it should be.
                            </p>
                            <p>
                                Today, we continue to innovate and expand, but our core values remain the same: quality food, exceptional
                                service, and customer satisfaction above all else.
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline" className="rounded-full group border-primary/30 hover:border-primary">
                                <Link href="/menu" className="flex items-center">
                                    View Our Menu
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section with Animated Cards */}
            <section className="py-24 relative">
                <div className="absolute mt-10 inset-0 bg-primary/5 -skew-y-3 transform origin-bottom-left"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Values</h2>
                        <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
                        <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="group">
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                                <CardHeader className="pb-2 text-center pt-8">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Utensils className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Quality First</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center px-8 pb-8">
                                    <p className="text-muted-foreground">
                                        We never compromise on the quality of our ingredients or the food we deliver. Every dish is prepared
                                        with care and attention to detail.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="group">
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                                <CardHeader className="pb-2 text-center pt-8">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Clock className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Timely Delivery</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center px-8 pb-8">
                                    <p className="text-muted-foreground">
                                        We understand that time is precious. That's why we strive to deliver your food as quickly as possible
                                        without sacrificing quality.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="group">
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                                <CardHeader className="pb-2 text-center pt-8">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Star className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Customer Satisfaction</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center px-8 pb-8">
                                    <p className="text-muted-foreground">
                                        Your satisfaction is our top priority. We go above and beyond to ensure every interaction with FoodApp
                                        exceeds your expectations.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section with Hover Effects */}
            <section className="py-20 overflow-hidden ">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Left Side Content */}
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-lg font-medium text-sm mb-2">
                                The Visionary
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-800">
                                Meet the <span className="text-gray-500">Creator</span>
                            </h2>

                            <div className="prose max-w-none text-slate-600">
                                <p className="text-lg">
                                    A passionate foodie and tech enthusiast with over 10 years of experience in the restaurant industry.
                                    John founded FoodApp with the vision of revolutionizing food delivery.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                                    <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Food Tech Expert</p>
                                        <p className="text-sm text-slate-500">Since 2019</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                                    <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Startup Founder</p>
                                        <p className="text-sm text-slate-500">3 Ventures</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Link href="https://www.instagram.com/prajzwolslimsulek/" target="_blank">
                                    <Button variant="ghost" size="sm" className="rounded-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect width="4" height="12" x="2" y="9" />
                                            <circle cx="4" cy="4" r="2" />
                                        </svg>
                                        Instagram
                                    </Button>
                                </Link>

                                <Link href="https://www.linkedin.com/in/prajjwol-shrestha-078884321/" target="_blank">
                                    <Button variant="ghost" size="sm" className="rounded-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect width="4" height="12" x="2" y="9" />
                                            <circle cx="4" cy="4" r="2" />
                                        </svg>
                                        LinkedIn
                                    </Button>
                                </Link>

                                <Link href="https://github.com/prajjwolcodes" target="_blank">
                                    <Button variant="ghost" size="sm" className="rounded-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                            <path d="M9 18c-4.51 2-5-2-7-2" />
                                        </svg>
                                        GitHub
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side Image */}
                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-30 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="relative w-full max-w-md mx-auto">
                                    {/* Decorative elements */}
                                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-xl transform rotate-12"></div>
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-xl transform -rotate-12"></div>

                                    {/* Main image container */}
                                    <div className="relative bg-white p-4 shadow-xl rounded-xl z-20">
                                        <div className="aspect-w-4 aspect-h-5 relative overflow-hidden rounded-lg">
                                            <Image
                                                src="/placeholder.svg?height=600&width=500"
                                                alt="Prajzwol - Founder"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Floating info card */}
                                        <div className="absolute -bottom-5 -right-5 bg-white px-4 py-3 rounded-lg shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">PS</div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">Prajjwol Shrestha</h3>
                                                    <p className="text-sm text-slate-500">Founder & CEO</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    )
}