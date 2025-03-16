import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FoodCard from "@/components/food-card"
import { getFoodItems } from "@/lib/data"

export default async function Home() {
  const foodItems = await getFoodItems()

  // Group food items by category
  const categories = foodItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof foodItems>)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Delicious Food Delivered to Your Door</h1>
          <p className="text-xl text-muted-foreground max-w-[700px]">
            Browse our menu and order your favorite dishes with just a few clicks.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild size="lg">
              <Link href="#menu">View Menu</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden mb-16">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Delicious food spread"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section id="menu" className="py-8">
        <h2 className="text-3xl font-bold mb-8">Our Menu</h2>

        <Tabs defaultValue={Object.keys(categories)[0]} className="w-full">
          <TabsList className="mb-8 flex flex-wrap h-auto">
            {Object.keys(categories).map((category) => (
              <TabsTrigger key={category} value={category} className="text-lg py-2">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([category, items]: [string, typeof foodItems]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}

