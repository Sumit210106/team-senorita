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

export function WasteTable() {
  const [wasteEntries, setWasteEntries] = useState([])
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Fetch initial data
    const fetchWasteEntries = async () => {
      const { data, error } = await supabase.from("waste_entries").select("*").order("date_added", { ascending: sorting === "asc" })
      if (error) {
        console.error("Error fetching waste entries:", error)
      } else {
        setWasteEntries(data)
      }
    }

    fetchWasteEntries()

    // Set up real-time subscription
    const subscription = supabase
      .channel("waste_entries")
      .on("postgres_changes", { event: "*", schema: "public", table: "waste_entries" }, fetchWasteEntries)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [sorting])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Waste Entries</CardTitle>
        <CardDescription>A list of all waste entries in the system. Click on an entry to edit or delete it.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">ID</TableHead>
              <TableHead className="w-[200px]">Product</TableHead>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead className="w-[150px]">Quantity</TableHead>
              <TableHead className="w-[200px]">
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
              <TableHead className="w-[200px]">Reason</TableHead>
              <TableHead className="w-[150px]">Cost</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wasteEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium w-[150px]">{entry.id}</TableCell>
                <TableCell className="w-[200px]">{entry.product}</TableCell>
                <TableCell className="w-[200px]">{entry.category}</TableCell>
                <TableCell className="w-[150px]">{`${entry.quantity} ${entry.unit}`}</TableCell>
                <TableCell className="w-[200px]">{entry.date_added}</TableCell>
                <TableCell className="w-[200px]">
                  <Badge
                    variant={
                      entry.reason === "Expired"
                        ? "destructive"
                        : entry.reason === "Damaged"
                          ? "outline"
                          : entry.reason === "Spoiled"
                            ? "secondary"
                            : "default"
                    }
                  >
                    {entry.reason}
                  </Badge>
                </TableCell>
                <TableCell className="w-[150px]">${entry.cost.toFixed(2)}</TableCell>
                <TableCell className="w-[150px] text-right">
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