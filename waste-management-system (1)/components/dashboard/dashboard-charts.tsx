"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartBars, ChartBar, ChartXAxis, ChartYAxis, ChartTooltip } from "@/components/ui/chart"

const wasteData = [
  { category: "Produce", amount: 65 },
  { category: "Dairy", amount: 45 },
  { category: "Bakery", amount: 35 },
  { category: "Meat", amount: 30 },
  { category: "Frozen", amount: 25 },
  { category: "Beverages", amount: 15 },
]

export function DashboardCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste by Category</CardTitle>
        <CardDescription>Total waste in kilograms by product category</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart className="h-[300px] w-full" data={wasteData}>
          <ChartContainer>
            <ChartYAxis />
            <ChartBars>
              {wasteData.map((d, i) => (
                <ChartBar key={i} value={d.amount} name={d.category} className="fill-primary" />
              ))}
            </ChartBars>
            <ChartXAxis />
            <ChartTooltip />
          </ChartContainer>
        </Chart>
      </CardContent>
    </Card>
  )
}

