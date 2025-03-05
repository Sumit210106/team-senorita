"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { supabase } from "@/lib/supabase"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function PredictedWasteChart() {
  const [chartData, setChartData] = useState<{ labels: string[]; quantities: number[] }>({
    labels: [],
    quantities: [],
  })

  useEffect(() => {
    const fetchAndPredictWaste = async () => {
      const { data, error } = await supabase.from("ai_predictor").select("waste_type, quantity")
      if (error) {
        console.error("Error fetching waste data:", error)
        return
      }

      // Aggregate waste quantity by category
      const categoryMap: Record<string, number[]> = {}
      data.forEach(({ waste_type, quantity }) => {
        if (!categoryMap[waste_type]) categoryMap[waste_type] = []
        categoryMap[waste_type].push(quantity)
      })

      // Compute Root Mean Square (RMS) for predictions
      const predictWaste = (quantities: number[]) => {
        if (quantities.length === 0) return 0
        const sumOfSquares = quantities.reduce((sum, q) => sum + q ** 2, 0)
        return Math.sqrt(sumOfSquares / quantities.length)
      }

      // Predict waste for next 10 days
      const predictedCategories = Object.keys(categoryMap)
      const predictedQuantities = predictedCategories.map((category) => predictWaste(categoryMap[category]) * 10)

      setChartData({
        labels: predictedCategories,
        quantities: predictedQuantities,
      })
    }

    fetchAndPredictWaste()
  }, [])

  return (
    <div className="w-full p-6 bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">📊 Predicted Waste by Category (Next 10 Days)</h2>
      <Bar
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: "Predicted Waste (Quantity)",
              data: chartData.quantities,
              backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
              borderColor: "rgba(255, 255, 255, 0.8)", // White borders
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, labels: { color: "white" } },
            title: { display: true, text: "Predicted Waste (in kg/liters/units) for Next 10 Days", color: "white" },
          },
          scales: {
            x: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
            y: { beginAtZero: true, ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
          },
        }}
      />
    </div>
  )
}
