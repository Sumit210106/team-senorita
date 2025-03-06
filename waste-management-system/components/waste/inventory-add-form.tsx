"use client"

import React, { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export function Addinventory() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    quantity: "",
    total_cost: "",
    expiry_date: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.product_name || !formData.category || !formData.quantity || !formData.total_cost || !date) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
  
    const wasteEntry = {
      id: crypto.randomUUID(),
      product_name: formData.product_name,
      category: formData.category,
      quantity: parseFloat(formData.quantity),  // Ensure number format
      date_added: new Date().toISOString().split("T")[0], // Current date
      total_cost: parseFloat(formData.total_cost).toFixed(2), // Ensure decimal format
      expiry_date: date?.toISOString().split("T")[0] // YYYY-MM-DD format
    };
  
    console.log("Submitting waste entry:", wasteEntry);
  
    const { error } = await supabase.from("inventory").insert([wasteEntry]);
  
    if (error) {
      console.error("Insert error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Inventory entry added successfully.",
      });
  
      // Reset form after successful submission
      setFormData({
        product_name: "",
        category: "",
        quantity: "",
        total_cost: "",
        expiry_date: ""
      });
      setDate(undefined);
    }
  };

  return (
    <div className="w-full"> 
      <Card>
        <CardHeader>
          <CardTitle>Add Inventory Entry</CardTitle>
          <CardDescription>
            Record a new inventory item with details about quantity, category, and expiration.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input id="product_name" placeholder="Enter product name" value={formData.product_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wet">Wet (edible)</SelectItem>
                    <SelectItem value="dry">Dry (edible)</SelectItem>
                    <SelectItem value="liquid">Liquid (edible)</SelectItem>
                    <SelectItem value="non-edible">Non-edible</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="other">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="0" step="0.01" placeholder="0.00" value={formData.quantity} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_cost">Total Cost (USD)</Label>
                <Input id="total_cost" type="number" min="0" step="0.01" placeholder="0.00" value={formData.total_cost} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select expiration date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Add Inventory Entry
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}