"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, X, ArrowDownAZ, ArrowUpZA, ArrowUp, ArrowDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import FoodCard from "@/components/food-card"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import type { FoodItem } from "@/lib/types"

export default function MenuPage() {
    const { toast } = useToast()
    const isMobile = useMobile()
    const [foodItems, setFoodItems] = useState<FoodItem[]>([])
    const [displayedItems, setDisplayedItems] = useState<FoodItem[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [sortOption, setSortOption] = useState("name-asc")
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

    // Animation states
    const [animateItems, setAnimateItems] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Fetch categories
                const categoriesResponse = await fetch("/api/categories")
                if (!categoriesResponse.ok) {
                    throw new Error("Failed to fetch categories")
                }
                const categoriesData = await categoriesResponse.json()
                setCategories(categoriesData)

                // Fetch food items
                const foodItemsResponse = await fetch("/api/food-items")
                if (!foodItemsResponse.ok) {
                    throw new Error("Failed to fetch food items")
                }
                const foodItemsData = await foodItemsResponse.json()
                setFoodItems(foodItemsData)
                setDisplayedItems(foodItemsData)
            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load menu data. Please try again later.",
                    variant: "destructive",
                })

                // Set mock data
                setCategories([
                    { id: "1", name: "Appetizers" },
                    { id: "2", name: "Main Courses" },
                    { id: "3", name: "Desserts" },
                    { id: "4", name: "Beverages" },
                    { id: "5", name: "Sides" },
                ])

                // Mock food items
                const mockItems = [
                    {
                        id: "1",
                        name: "Classic Burger",
                        description: "Juicy beef patty with lettuce, tomato, and special sauce",
                        price: 9.99,
                        category: "2", // Main Courses
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: "2",
                        name: "Caesar Salad",
                        description: "Fresh romaine lettuce with Caesar dressing and croutons. Vegetarian friendly.",
                        price: 7.99,
                        category: "1", // Appetizers
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: "3",
                        name: "Chocolate Cake",
                        description: "Rich chocolate cake with a layer of ganache. Gluten-free option available.",
                        price: 5.99,
                        category: "3", // Desserts
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: "4",
                        name: "Fresh Lemonade",
                        description: "Freshly squeezed lemons with a hint of mint. Dairy-free and vegan.",
                        price: 3.99,
                        category: "4", // Beverages
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: "5",
                        name: "Truffle Fries",
                        description: "Crispy fries tossed in truffle oil and parmesan. Vegetarian friendly.",
                        price: 6.99,
                        category: "5", // Sides
                        image: "/placeholder.svg?height=200&width=200",
                    },
                    {
                        id: "6",
                        name: "Margherita Pizza",
                        description: "Classic pizza with tomato sauce, mozzarella, and basil. Vegetarian friendly.",
                        price: 11.99,
                        category: "2", // Main Courses
                        image: "/placeholder.svg?height=200&width=200",
                    },
                ]

                setFoodItems(mockItems)
                setDisplayedItems(mockItems)
            } finally {
                setIsLoading(false)
                // Trigger animation for initial load
                setTimeout(() => setAnimateItems(true), 100)
            }
        }

        fetchData()
    }, [toast])

    const applyFilters = () => {
        setAnimateItems(false)

        const filtered = foodItems
            .filter((item) => {
                // Search query filter
                if (
                    searchQuery &&
                    !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    return false
                }

                // Category filter
                if (selectedCategories.length > 0) {
                    const categoryId = typeof item.category === "string" ? item.category : item.category.id
                    if (!selectedCategories.includes(categoryId)) {
                        return false
                    }
                }

                return true
            })
            .sort((a, b) => {
                switch (sortOption) {
                    case "name-asc":
                        return a.name.localeCompare(b.name)
                    case "name-desc":
                        return b.name.localeCompare(a.name)
                    case "price-asc":
                        return a.price - b.price
                    case "price-desc":
                        return b.price - a.price
                    default:
                        return 0
                }
            })

        setDisplayedItems(filtered)

        // Re-enable animations after a short delay
        setTimeout(() => setAnimateItems(true), 100)

        // Close filter dialog after applying
        setIsFilterDialogOpen(false)
    }

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    const handleResetFilters = () => {
        setSearchQuery("")
        setSelectedCategories([])
        setSortOption("name-asc")
    }

    const handleSortOptionChange = (option: string) => {
        setSortOption(option)
    }

    const openFilterDialog = () => {
        setIsFilterDialogOpen(true)
    }

    const FoodCards = ({ item }: { item: FoodItem }) => {
        const categoryName = categories.find(c => c.id === (typeof item.category === "string" ? item.category : item.category.id))?.name || "Menu Item"

        return (
            <div className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 transform ${animateItems ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                        src={item.image || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">Rs {Number(item.price).toFixed(2)}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-xs text-white/80">{categoryName}</p>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-1">
                            {item.description.toLowerCase().includes("vegetarian") && (
                                <Badge variant="outline" className="text-xs">🥗</Badge>
                            )}
                            {item.description.toLowerCase().includes("vegan") && (
                                <Badge variant="outline" className="text-xs">🌱</Badge>
                            )}
                            {item.description.toLowerCase().includes("gluten-free") && (
                                <Badge variant="outline" className="text-xs">🌾</Badge>
                            )}
                            {item.description.toLowerCase().includes("dairy-free") && (
                                <Badge variant="outline" className="text-xs">🥛</Badge>
                            )}
                        </div>
                        <Button size="sm" className="rounded-full">Order</Button>
                    </div>
                </div>
            </div>
        )
    }

    const FilterPanel = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-medium mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`
                                flex items-center justify-center p-2 rounded-lg cursor-pointer border transition-colors
                                ${selectedCategories.includes(category.id)
                                    ? "bg-primary/10 border-primary"
                                    : "border-gray-200 hover:bg-gray-100"}
                            `}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            <span className="text-sm">{category.name}</span>
                            {selectedCategories.includes(category.id) && (
                                <Checkbox checked className="ml-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-md font-medium mb-3">Sort By</h3>
                <RadioGroup value={sortOption} onValueChange={setSortOption} className="space-y-2">
                    <div className="flex items-center p-2 border rounded-lg justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="name-asc">Name (A-Z)</Label>
                        </div>
                        <RadioGroupItem value="name-asc" id="name-asc" />
                    </div>
                    <div className="flex items-center p-2 border rounded-lg justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowUpZA className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="name-desc">Name (Z-A)</Label>
                        </div>
                        <RadioGroupItem value="name-desc" id="name-desc" />
                    </div>
                    <div className="flex items-center p-2 border rounded-lg justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowUp className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="price-asc">Price (Low to High)</Label>
                        </div>
                        <RadioGroupItem value="price-asc" id="price-asc" />
                    </div>
                    <div className="flex items-center p-2 border rounded-lg justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="price-desc">Price (High to Low)</Label>
                        </div>
                        <RadioGroupItem value="price-desc" id="price-desc" />
                    </div>
                </RadioGroup>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Hero Section with Parallax Effect */}
            <section className="relative h-72 sm:h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/placeholder.svg?height=1000&width=2000')",
                        transform: "translateY(0px)",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-6">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Our Delicious Menu</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto">
                        Explore our chef-crafted dishes, made with the freshest ingredients and love.
                    </p>
                </div>
            </section>

            {/* Search Bar with Floating Effect */}
            <section className="container mx-auto px-4 relative -mt-8 mb-12">
                <Card className="shadow-xl">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search dishes, ingredients, or dietary preferences..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 py-6 text-lg"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={openFilterDialog}
                                    variant="outline"
                                    className="flex items-cente py-6 r gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters

                                </Button>
                                <Button className="py-6" onClick={applyFilters}>Search</Button>
                            </div>
                        </div>

                        {/* Quick category pills */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {categories.map((category) => (
                                <Badge
                                    key={category.id}
                                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                                    className="cursor-pointer py-2 px-3"
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    {category.name}
                                </Badge>
                            ))}

                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Filter Dialog */}
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Filter Menu Items</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <FilterPanel />
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                            Reset Filters
                        </Button>
                        <Button onClick={applyFilters} className="flex-1">
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Content */}
            <section className="container mx-auto px-4 pb-24">
                <div>
                    {/* Food Items Grid */}
                    <div>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-24">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                            </div>
                        ) : displayedItems.length === 0 ? (
                            <div className="text-center py-24 bg-muted/30 rounded-xl">
                                <h3 className="text-2xl font-medium mb-3">No dishes found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                                <Button onClick={handleResetFilters} size="lg">Reset All Filters</Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        {displayedItems.length} {displayedItems.length === 1 ? "Item" : "Items"}
                                    </h2>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {displayedItems.map((item) => (
                                        <FoodCard
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}