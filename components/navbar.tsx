"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { useMobile } from "@/hooks/use-mobile"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { mockShopDetails } from "@/lib/data"

export default function Navbar() {
  const { data: session } = useSession()

  const pathname = usePathname()
  const { totalItems } = useCart()
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)
  const [shopData, setShopData] = useState(mockShopDetails)

  async function fetchShopData() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setShopData(data)
    } catch (error) {
      console.error("Error fetching shop data:", error)
      setShopData(mockShopDetails)
    }

  }

  useEffect(() => {
    fetchShopData()
  }, [])


  // Handle hydration mismatch
  useEffect(() => {

    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isAdminPage = pathname.startsWith("/admin")

  if (isAdminPage) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="/" className="flex w-full items-center py-3 text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/#menu" className="flex w-full items-center py-3 text-sm font-medium">
                    Menu
                  </Link>
                  <Link href="/about" className="flex w-full items-center py-3 text-sm font-medium">
                    About
                  </Link>
                  <Link href="/contact" className="flex w-full items-center py-3 text-sm font-medium">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">{shopData[0].name}</span>
          </Link>

          {!isMobile && (
            <nav className="ml-8 flex gap-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground" : "text-foreground/60"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/#menu"
                className={`transition-colors hover:text-foreground/80 ${pathname === "/#menu" ? "text-foreground" : "text-foreground/60"
                  }`}
              >
                Menu
              </Link>
              <Link
                href="/about"
                className={`transition-colors hover:text-foreground/80 ${pathname === "/about" ? "text-foreground" : "text-foreground/60"
                  }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`transition-colors hover:text-foreground/80 ${pathname === "/contact" ? "text-foreground" : "text-foreground/60"
                  }`}
              >
                Contact
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 mt-2">

              {session && session?.user ? (
                <>
                  <DropdownMenuLabel className="font-bold text-gray-700">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={session?.user && session?.user?.role === "ADMIN" ? "/admin" : `/${session?.user?.name}`}>
                    <DropdownMenuItem className="text-base text-gray-600">
                      {session?.user && session?.user?.role === "ADMIN" ? "Admin" : "User"}  | {session?.user && session?.user?.name}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 cursor-pointer text-base hover:text-red-700 hover:bg-red-50"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-bold text-gray-700">Digital Bhatti</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link href="/auth/login">

                    <DropdownMenuItem className="text-gray-600 text-base cursor-pointer hover:text-blue-600">
                      Login
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

