"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function InventoryTable() {
  const [inventory, setInventory] = useState([])
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from("inventory").select("*").order("date_added", { ascending: sorting === "asc" })
      if (error) {
        console.error("Error fetching inventory:", error)
      } else {
        const updatedData = applyDiscounts(data)
        setInventory(updatedData)
      }
    }

    fetchInventory()

    const subscription = supabase
      .channel("inventory")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, fetchInventory)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [sorting])

  const applyDiscounts = (items) => {
    const today = new Date()

    return items.map((item) => {
      if (!item.expiry_date) return item

      const expiryDate = new Date(item.expiry_date)
      const daysToExpire = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24))

      if (daysToExpire <= 6 && daysToExpire >= 0) {
        let discountPercentage = 0

        if (item.total_cost > 1000) discountPercentage = 50
        else if (item.total_cost > 500) discountPercentage = 30
        else if (item.total_cost > 100) discountPercentage = 20
        else discountPercentage = 10

        const discountedPrice = (item.total_cost * (1 - discountPercentage / 100)).toFixed(2)

        updateDiscountInSupabase(item.id, discountPercentage, discountedPrice)

        return { ...item, discountPercentage, discountedPrice }
      }

      return { ...item, discountPercentage: 0, discountedPrice: item.total_cost }
    })
  }

  const updateDiscountInSupabase = async (id, discount, discountedPrice) => {
    const { error } = await supabase.from("inventory").update({ discount, discounted_price: discountedPrice }).eq("id", id)

    if (error) {
      console.error("Error updating discount:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>Automated discounts applied for near-expiry products.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date Added
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-8 w-8 p-0"
                    onClick={() => setSorting(sorting === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Discounted Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.product_name}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.date_added}</TableCell>
                <TableCell>{entry.expiry_date}</TableCell>
                <TableCell>${entry.total_cost}</TableCell>
                <TableCell>
                  {entry.discountPercentage > 0 ? (
                    <Badge className="bg-green-600">{entry.discountPercentage}% Off</Badge>
                  ) : (
                    <Badge className="bg-gray-500">No Discount</Badge>
                  )}
                </TableCell>
                <TableCell className="font-bold text-green-400">${entry.discountedPrice}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
