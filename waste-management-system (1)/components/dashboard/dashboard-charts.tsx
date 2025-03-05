"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, ChartDoughnut, ChartLine } from "@/components/ui/chart";

// Data for the bar chart (Waste by Category)
const wasteBarData = {
  labels: ["Produce", "Dairy", "Bakery", "Meat", "Frozen", "Beverages"],
  datasets: [
    {
      label: "Waste by Category",
      data: [65, 45, 35, 30, 25, 15],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

// Data for the doughnut chart (Waste Distribution)
const wasteDoughnutData = {
  labels: ["Recyclable", "Non Recyclable", "Expired"],
  datasets: [
    {
      label: "Waste Distribution",
      data: [50, 30, 20],
      backgroundColor: [
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Data for the line chart (Waste Trend)
const wasteLineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Waste Trend",
      data: [15, 25, 20, 30, 35],
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 2,
      fill: false,
      tension: 0.4, // smooth curve
    },
  ],
};

export function DashboardCharts() {
  return (
    <>
      {/* Bar Chart Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Waste by Category</CardTitle>
          <CardDescription>Total waste in kilograms by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartBar
            data={wasteBarData}
            options={{
              scales: { y: { beginAtZero: true } },
            }}
            className="h-[300px] w-full"
          />
        </CardContent>
      </Card>

      {/* Doughnut Chart Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Waste Distribution</CardTitle>
          <CardDescription>
            Distribution of waste into recyclable, non recyclable, and expired categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartDoughnut
            data={wasteDoughnutData}
            options={{
              plugins: {
                legend: {
                  position: "right",
                },
              },
            }}
            className="h-[300px] w-full"
          />
        </CardContent>
      </Card>

      {/* Line Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Trend</CardTitle>
          <CardDescription>Trend of waste over the first five months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartLine
            data={wasteLineData}
            options={{
              plugins: {
                arrowPlugin: { arrowSize: 12 },
                legend: { display: true },
              },
              scales: { y: { beginAtZero: true } },
            }}
            className="h-[300px] w-full"
          />
        </CardContent>
      </Card>
    </>
  );
}
