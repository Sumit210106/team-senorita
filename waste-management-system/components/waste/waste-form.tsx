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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export function WasteForm() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    product: "",
    category: "",
    quantity: "",
    unit: "",
    cost: "",
    reason: "",
    notes: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.product || !formData.category || !formData.quantity || !formData.unit || !formData.cost || !date || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
  
    const wasteEntry = {
      id: crypto.randomUUID(),
      product: formData.product,
      category: formData.category,
      quantity: parseFloat(formData.quantity),  // Ensure number format
      date_added: date?.toISOString().split("T")[0], // YYYY-MM-DD format
      reason: formData.reason,
      cost: parseFloat(formData.cost).toFixed(2), // Ensure decimal format
    };
  
    console.log("Submitting waste entry:", wasteEntry);
  
    const { error } = await supabase.from("waste_entries").insert([wasteEntry]);
  
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
        description: "Waste entry added successfully.",
      });
  
      // Reset form after successful submission
      setFormData({
        product: "",
        category: "",
        quantity: "",
        unit: "",
        cost: "",
        reason: "",
        notes: "",
      });
      setDate(undefined);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto"> {/* Adjust the max-width as needed */}
      <Card>
        <CardHeader>
          <CardTitle>Add Waste Entry</CardTitle>
          <CardDescription>
            Record a new waste item with details about quantity, category, and expiration.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name</Label>
                <Input id="product" placeholder="Enter product name" value={formData.product} onChange={handleChange} required />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="0" step="0.01" placeholder="0.00" value={formData.quantity} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select onValueChange={(value) => handleSelectChange("unit", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="l">Liters (L)</SelectItem>
                    <SelectItem value="ml">Milliliters (mL)</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (USD)</Label>
                <Input id="cost" type="number" min="0" step="0.01" placeholder="0.00" value={formData.cost} onChange={handleChange} required />
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
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Waste</Label>
              <Select onValueChange={(value) => handleSelectChange("reason", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="spoiled">Spoiled</SelectItem>
                  <SelectItem value="overproduction">Overproduction</SelectItem>
                  <SelectItem value="quality">Quality Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Add Waste Entry
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}