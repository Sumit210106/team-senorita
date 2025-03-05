"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { AlertCircle, Bell, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Function to apply discount based on expiry
const applyDiscount = (price: number, expiryDate: string) => {
  const currentDate = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

  let discount = 0
  if (diffDays <= 6) {
    if (price > 1000) discount = 50
    else if (price > 500) discount = 30
    else if (price > 100) discount = 20
    else discount = 10
  }

  const discountedPrice = price - (price * discount) / 100
  return { discountedPrice, discount, diffDays }
}

export function InventoryAlerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from("inventory").select("*")
      if (error) {
        console.error("Error fetching inventory:", error)
        return
      }

      const alertList = data
        .map((entry) => {
          const { discount, diffDays } = applyDiscount(entry.total_cost, entry.expiry_date)

          if (diffDays <= 5) {
            return { type: "Expiration", message: `${entry.product_name} expires in ${diffDays} days!`, severity: "high" }
          } else if (discount > 0) {
            return { type: "Waste Risk", message: `${entry.product_name} is highly discounted (${discount}% off)!`, severity: "medium" }
          } else if (entry.quantity < 10) {
            return { type: "Low Stock", message: `${entry.product_name} stock is low!`, severity: "low" }
          }
          return null
        })
        .filter(Boolean)

      setAlerts(alertList)
    }

    fetchInventory()

    const subscription = supabase
      .channel("inventory")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, fetchInventory)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return (
    <Card className="w-full bg-gray-900 text-white">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>⚠ AI Alerts</CardTitle>
        <Button variant="outline" className="text-white">
          <Bell className="h-5 w-5 mr-2" />
          {alerts.length} Alerts
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-green-400 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" /> No critical alerts.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center p-3 rounded-lg",
                  alert.severity === "high" ? "bg-red-600" : alert.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"
                )}
              >
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>{alert.message}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {alert.type}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
