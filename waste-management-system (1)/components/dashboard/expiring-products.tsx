"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartBars, ChartBar, ChartXAxis, ChartYAxis, ChartTooltip } from "@/components/ui/chart"

const expiringData = [
  { day: "Today", count: 5 },
  { day: "Tomorrow", count: 3 },
  { day: "In 2 days", count: 4 },
  { day: "In 3 days", count: 2 },
  { day: "In 4 days", count: 1 },
  { day: "In 5 days", count: 2 },
  { day: "In 6 days", count: 1 },
]

export function ExpiringProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Products</CardTitle>
        <CardDescription>Products expiring in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart className="h-[300px] w-full" data={expiringData}>
          <ChartContainer>
            <ChartYAxis />
            <ChartBars>
              {expiringData.map((d, i) => (
                <ChartBar key={i} value={d.count} name={d.day} className="fill-destructive" />
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

