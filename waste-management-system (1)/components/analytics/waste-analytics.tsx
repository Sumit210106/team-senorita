"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartBars, ChartBar, ChartXAxis, ChartYAxis, ChartTooltip } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for waste analytics
const wasteByReasonData = [
  { reason: "Expired", amount: 120 },
  { reason: "Damaged", amount: 45 },
  { reason: "Spoiled", amount: 65 },
  { reason: "Quality", amount: 30 },
  { reason: "Overproduction", amount: 55 },
  { reason: "Other", amount: 15 },
]

const wasteTrendData = [
  { month: "Jan", amount: 85 },
  { month: "Feb", amount: 75 },
  { month: "Mar", amount: 90 },
  { month: "Apr", amount: 65 },
  { month: "May", amount: 70 },
  { month: "Jun", amount: 60 },
  { month: "Jul", amount: 75 },
  { month: "Aug", amount: 85 },
  { month: "Sep", amount: 90 },
  { month: "Oct", amount: 80 },
  { month: "Nov", amount: 75 },
]

export function WasteAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Analytics</CardTitle>
        <CardDescription>Analyze waste patterns and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="byReason">
          <TabsList className="mb-4">
            <TabsTrigger value="byReason">By Reason</TabsTrigger>
            <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
          </TabsList>
          <TabsContent value="byReason">
            <Chart className="h-[350px] w-full" data={wasteByReasonData}>
              <ChartContainer>
                <ChartYAxis />
                <ChartBars>
                  {wasteByReasonData.map((d, i) => (
                    <ChartBar key={i} value={d.amount} name={d.reason} className="fill-primary" />
                  ))}
                </ChartBars>
                <ChartXAxis />
                <ChartTooltip />
              </ChartContainer>
            </Chart>
          </TabsContent>
          <TabsContent value="trend">
            <Chart className="h-[350px] w-full" data={wasteTrendData}>
              <ChartContainer>
                <ChartYAxis />
                <ChartBars>
                  {wasteTrendData.map((d, i) => (
                    <ChartBar key={i} value={d.amount} name={d.month} className="fill-primary" />
                  ))}
                </ChartBars>
                <ChartXAxis />
                <ChartTooltip />
              </ChartContainer>
            </Chart>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

