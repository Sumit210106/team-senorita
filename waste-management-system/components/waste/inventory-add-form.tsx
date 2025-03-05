"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ArrowUpDown, Bell, MoreHorizontal, Pencil, Trash } from "lucide-react"
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(price);
};

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
  return { discountedPrice, discount, diffDays };
};

export function InventoryTable() {
  const [inventory, setInventory] = useState([])
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from("inventory").select("*").order("date_added", { ascending: sorting === "asc" })
      if (error) {
        console.error("Error fetching inventory:", error)
      } else {
        setInventory(data)
        generateAlerts(data)
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

  const generateAlerts = (data) => {
    const newAlerts = data
      .map((entry) => {
        const { discount, diffDays } = applyDiscount(entry.total_cost, entry.expiry_date);
        if (diffDays <= 5) {
          return { message: `${entry.product_name} expires in ${diffDays} days!`, severity: "high" };
        } else if (discount > 0) {
          return { message: `${entry.product_name} is highly discounted (${discount}% off)!`, severity: "medium" };
        } else if (entry.quantity < 10) {
          return { message: `${entry.product_name} stock is low!`, severity: "low" };
        }
        return null;
      })
      .filter(Boolean);

    setAlerts(newAlerts);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>A list of all inventory items with real-time alerts.</CardDescription>
        </div>
        <Button variant="outline" className="text-white">
          <Bell className="h-5 w-5 mr-2" />
          {alerts.length} Alerts
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 && (
          <div className="mb-4">
            {alerts.map((alert, index) => (
              <p key={index} className={`p-2 rounded ${alert.severity === "high" ? "bg-red-600" : alert.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"}`}>
                {alert.message}
              </p>
            ))}
          </div>
        )}
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
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.product_name}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.date_added}</TableCell>
                  <TableCell>{entry.expiry_date}</TableCell>
                  <TableCell>{formatPrice(entry.total_cost)}</TableCell>
                  <TableCell>{discount > 0 ? `${formatPrice(discountedPrice)} (${discount}% Off)` : formatPrice(entry.total_cost)}</TableCell>
                  <TableCell className="text-right">...</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
