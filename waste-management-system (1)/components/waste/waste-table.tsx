"use client"

import { useState } from "react"
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

// Sample data
const wasteEntries = [
  {
    id: "WE001",
    product: "Organic Apples",
    category: "Produce",
    quantity: 5.2,
    unit: "kg",
    cost: 15.6,
    expirationDate: "2023-05-15",
    reason: "Expired",
    dateAdded: "2023-05-16",
  },
  {
    id: "WE002",
    product: "Whole Milk",
    category: "Dairy",
    quantity: 3,
    unit: "L",
    cost: 9.0,
    expirationDate: "2023-05-14",
    reason: "Expired",
    dateAdded: "2023-05-15",
  },
  {
    id: "WE003",
    product: "Sourdough Bread",
    category: "Bakery",
    quantity: 2,
    unit: "units",
    cost: 8.5,
    expirationDate: "2023-05-13",
    reason: "Quality Issues",
    dateAdded: "2023-05-13",
  },
  {
    id: "WE004",
    product: "Ground Beef",
    category: "Meat",
    quantity: 1.5,
    unit: "kg",
    cost: 18.75,
    expirationDate: "2023-05-12",
    reason: "Spoiled",
    dateAdded: "2023-05-12",
  },
  {
    id: "WE005",
    product: "Frozen Pizza",
    category: "Frozen",
    quantity: 4,
    unit: "units",
    cost: 24.0,
    expirationDate: "2023-06-20",
    reason: "Damaged",
    dateAdded: "2023-05-11",
  },
]

export function WasteTable() {
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Waste Entries</CardTitle>
        <CardDescription>
          A list of all waste entries in the system. Click on an entry to edit or delete it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
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
              <TableHead>Reason</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wasteEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.product}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{`${entry.quantity} ${entry.unit}`}</TableCell>
                <TableCell>{entry.dateAdded}</TableCell>
                <TableCell>
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
                <TableCell>${entry.cost.toFixed(2)}</TableCell>
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

