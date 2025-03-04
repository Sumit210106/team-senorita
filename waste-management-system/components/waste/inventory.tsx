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

// Function to format price in INR (₹)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(price);
};

// Function to apply discount based on price
const applyDiscount = (price: number, expiryDate: string) => {
  const currentDate = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  let discount = 0;
  if (diffDays <= 6) {
    if (price > 1000) discount = 50;
    else if (price > 500) discount = 30;
    else if (price > 100) discount = 20;
    else discount = 10;
  }

  const discountedPrice = price - (price * discount) / 100;
  return { discountedPrice, discount };
};

export function InventoryTable() {
  const [inventory, setInventory] = useState([])
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Fetch initial data
    const fetchInventory = async () => {
      const { data, error } = await supabase.from("inventory").select("*").order("date_added", { ascending: sorting === "asc" })
      if (error) {
        console.error("Error fetching inventory:", error)
      } else {
        setInventory(data)
      }
    }

    fetchInventory()

    // Set up real-time subscription
    const subscription = supabase
      .channel("inventory")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, fetchInventory)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [sorting])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>A list of all inventory items. Click on an entry to edit or delete it.</CardDescription>
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
              <TableHead>Discounted Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((entry) => {
              const { discountedPrice, discount } = applyDiscount(entry.total_cost, entry.expiry_date);
              return (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.id}</TableCell>
                  <TableCell>{entry.product_name}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.date_added}</TableCell>
                  <TableCell>{entry.expiry_date}</TableCell>
                  <TableCell>{formatPrice(entry.total_cost)}</TableCell>
                  <TableCell>
                    {discount > 0 ? (
                      <>
                        <span className="text-red-600 font-bold">{formatPrice(discountedPrice)}</span>
                        <span className="ml-2 text-sm text-gray-500">({discount}% Off)</span>
                      </>
                    ) : (
                      <span>{formatPrice(entry.total_cost)}</span>
                    )}
                  </TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}