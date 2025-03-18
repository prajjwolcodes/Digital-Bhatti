"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { mockShopDetails } from "@/lib/data"
import { useEffect, useState } from "react"

export default function Footer() {
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

  return (
    <footer className="mx-auto border-t bg-muted/40">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{shopData[0].name}</h3>
            <p className="text-sm text-muted-foreground">
              Delicious food delivered to your door. Browse our menu and order your favorite dishes with just a few
              clicks.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#menu" className="text-muted-foreground hover:text-foreground">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href={shopData[0].facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href={shopData[0].twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href={shopData[0].instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Email: {shopData[0].email}</p>
              <p className="text-muted-foreground">Phone: {shopData[0].phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FoodApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

