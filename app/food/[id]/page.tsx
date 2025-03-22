import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/add-to-cart-button"
import { getFoodItem } from "@/lib/data"

interface FoodDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FoodDetailPage(props: FoodDetailPageProps) {
  const params = await props.params;
  const foodItem = await getFoodItem(params.id)

  if (!foodItem) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={foodItem.image || `/placeholder.svg?height=400&width=400`}
            alt={foodItem.name}
            height={500}
            width={600}
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {foodItem.category}
            </Badge>
            <h1 className="text-3xl font-bold">{foodItem.name}</h1>
            <div className="text-2xl font-semibold text-primary mt-2">Rs {foodItem.price.toFixed(2)}</div>
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{foodItem.description}</p>

            {foodItem.ingredients && (
              <>
                <h3 className="text-xl font-medium mt-6 mb-2">Ingredients</h3>
                <ul className="list-disc pl-5">
                  {foodItem.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-muted-foreground">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {foodItem.nutritionalInfo && (
              <>
                <h3 className="text-xl font-medium mt-6 mb-2">Nutritional Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(foodItem.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-auto">
            <AddToCartButton item={foodItem} />
          </div>
        </div>
      </div>
    </div>
  )
}

