"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartBar, ChartDoughnut, ChartLine } from "@/components/ui/chart";
import { supabase } from "@/lib/supabase";

export function DashboardCharts() {
  const [barData, setBarData] = useState<any>(null);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [lineData, setLineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      // Fetch data for Bar Chart (and Doughnut Chart) from the "waste_entries" table
      const { data: rawData, error } = await supabase
        .from("waste_entries")
        .select("category, quantity, recyclable");
      if (error) {
        console.error("Error fetching waste entries data:", error);
      }

      // Process data for Bar Chart
      const barLabels = rawData ? rawData.map((item: any) => item.category) : [];
      const barAmounts = rawData ? rawData.map((item: any) => Number(item.quantity)) : [];
      const barChartData = {
        labels: barLabels,
        datasets: [
          {
            label: "Waste by Category",
            data: barAmounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

      // Process data for Doughnut Chart: Group by recyclable (yes or no)
      const recyclableYesTotal = rawData
        ? rawData
            .filter((item: any) => item.recyclable === "yes")
            .reduce((sum: number, item: any) => sum + Number(item.quantity), 0)
        : 0;
      const recyclableNoTotal = rawData
        ? rawData
            .filter((item: any) => item.recyclable === "no")
            .reduce((sum: number, item: any) => sum + Number(item.quantity), 0)
        : 0;
      const doughnutChartData = {
        labels: ["Recyclable", "Non recyclable"],
        datasets: [
          {
            label: "Waste Distribution",
            data: [recyclableYesTotal, recyclableNoTotal],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // (Optional) Process data for Line Chart if needed...
      // const { data: lineRaw, error: lineError } = await supabase
      //   .from("waste_trend")
      //   .select("month, quantity");
      // if (lineError) {
      //   console.error("Error fetching line chart data:", lineError);
      // }
      // const lineLabels = lineRaw ? lineRaw.map((item: any) => item.month) : [];
      // const lineAmounts = lineRaw ? lineRaw.map((item: any) => Number(item.quantity)) : [];
      // const lineChartData = {
      //   labels: lineLabels,
      //   datasets: [
      //     {
      //       label: "Waste Trend",
      //       data: lineAmounts,
      //       borderColor: "rgba(153, 102, 255, 1)",
      //       borderWidth: 2,
      //       fill: false,
      //       tension: 0.4, // smooth curve
      //     },
      //   ],
      // };

      setBarData(barChartData);
      setDoughnutData(doughnutChartData);
      // setLineData(lineChartData);
      setLoading(false);
    }

    fetchAllData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Bar Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Waste by Category</CardTitle>
          <CardDescription>
            Total waste in kilograms by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barData ? (
            <ChartBar
              data={barData}
              options={{
                scales: { y: { beginAtZero: true } },
              }}
              className="h-[300px] w-full"
            />
          ) : (
            <p>No bar data available</p>
          )}
        </CardContent>
      </Card>

      {/* Doughnut Chart Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Waste Distribution</CardTitle>
          <CardDescription>
            Distribution of waste into recyclable and non recyclable categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doughnutData ? (
            <ChartDoughnut
              data={doughnutData}
              options={{
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
              className="h-[300px] w-full"
            />
          ) : (
            <p>No doughnut data available</p>
          )}
        </CardContent>
      </Card>

      {/* Line Chart Card (Optional) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Waste Trend</CardTitle>
          <CardDescription>Trend of waste over time</CardDescription>
        </CardHeader>
        {/* <CardContent>
          {lineData ? (
            <ChartLine
              data={lineData}
              options={{
                plugins: {
                  arrowPlugin: { arrowSize: 12 },
                  legend: { display: true },
                },
                scales: { y: { beginAtZero: true } },
              }}
              className="h-[300px] w-full"
            />
          ) : (
            <p>No line data available</p>
          )}
        </CardContent> */}
      </Card>
    </>
  );
}
