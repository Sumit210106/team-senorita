"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartLine, ChartXAxis, ChartYAxis, ChartTooltip } from "@/components/ui/chart"

// Sample data for sales prediction
const salesPredictionData = [
  { month: "Jan", predicted: 12500, actual: 11800 },
  { month: "Feb", predicted: 13200, actual: 12900 },
  { month: "Mar", predicted: 14100, actual: 14300 },
  { month: "Apr", predicted: 15000, actual: 14100 },
  { month: "May", predicted: 16200, actual: 15800 },
  { month: "Jun", predicted: 17500, actual: 16900 },
  { month: "Jul", predicted: 18200, actual: 17500 },
  { month: "Aug", predicted: 19000, actual: 18200 },
  { month: "Sep", predicted: 19800, actual: 19100 },
  { month: "Oct", predicted: 20500, actual: 19800 },
  { month: "Nov", predicted: 21200, actual: 20500 },
  { month: "Dec", predicted: 22000, actual: null },
]

export function SalesPrediction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Prediction vs. Actual</CardTitle>
        <CardDescription>Compare predicted sales against actual sales data</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart className="h-[350px] w-full" data={salesPredictionData}>
          <ChartContainer>
            <ChartYAxis />
            <ChartLine name="Predicted" dataKey="predicted" className="stroke-blue-500 stroke-2" />
            <ChartLine name="Actual" dataKey="actual" className="stroke-primary stroke-2" />
            <ChartXAxis dataKey="month" />
            <ChartTooltip />
          </ChartContainer>
        </Chart>
      </CardContent>
    </Card>
  )
}

