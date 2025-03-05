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

      // Process data for Bar Chart: Group by category and sum the quantities
      const groupedByCategory = rawData ? rawData.reduce((acc: any, item: any) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Number(item.quantity);
        return acc;
      }, {}) : {};

      const barLabels = Object.keys(groupedByCategory);
      const barAmounts = Object.values(groupedByCategory);
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

      // Fetch data for Line Chart from the "waste_trend" table
      const { data: lineRaw, error: lineError } = await supabase
        .from("waste_entries")
        .select("date_added, cost");
      if (lineError) {
        console.error("Error fetching line chart data:", lineError);
      }

      // Group data by date and sum the cost
      const groupedByDate = lineRaw ? lineRaw.reduce((acc: any, item: any) => {
        const date = item.date_added;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(item.cost);
        return acc;
      }, {}) : {};

      // Prepare data for Line Chart
      const lineLabels = Object.keys(groupedByDate);
      const lineAmounts = Object.values(groupedByDate);
      const lineChartData = {
        labels: lineLabels,
        datasets: [
          {
            label: "Revenue Lost",
            data: lineAmounts,
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4, // smooth curve
          },
        ],
      };

      setBarData(barChartData);
      setDoughnutData(doughnutChartData);
      setLineData(lineChartData);
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
            Total waste in units by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barData ? (
            <ChartBar
              data={barData}
              options={{
                scales: { y: { beginAtZero: true } },
              }}
              className="h-[40px] w-full" // Adjusted height
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
              className="h-[250px] w-full"
            />
          ) : (
            <p>No doughnut data available</p>
          )}
        </CardContent>
      </Card>

      {/* Line Chart Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Revenue Lost</CardTitle>
          <CardDescription>Revenue lost due to Wastage</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  );
}
