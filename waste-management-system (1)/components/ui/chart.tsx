"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartConfiguration,
  ChartTypeRegistry,
  BarController,
  LineController,
  DoughnutController
} from "chart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components including ArcElement for doughnut charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
);

// Custom plugin to draw an arrow on the end of a line chart
const arrowPlugin = {
  id: "arrowPlugin",
  afterDatasetsDraw(chart: ChartJS, args: any, options: any) {
    const { ctx, data } = chart;
    data.datasets.forEach((dataset: any, datasetIndex: number) => {
      // Only add arrow for line charts
      const config = chart.config as ChartConfiguration<keyof ChartTypeRegistry>;
      if (config.type === "line") {
        const meta = chart.getDatasetMeta(datasetIndex);
        const points = meta.data;
        if (points.length > 1) {
          const lastPoint = points[points.length - 1];
          const secondLastPoint = points[points.length - 2];
          const angle = Math.atan2(
            lastPoint.y - secondLastPoint.y,
            lastPoint.x - secondLastPoint.x
          );
          ctx.save();
          ctx.translate(lastPoint.x, lastPoint.y);
          ctx.rotate(angle);
          ctx.fillStyle = dataset.borderColor || "black";
          const arrowSize = options.arrowSize || 10;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-arrowSize, arrowSize / 2);
          ctx.lineTo(-arrowSize, -arrowSize / 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    });
  },
};

// Register the custom arrow plugin
ChartJS.register(arrowPlugin);

// Generic Chart component that creates a Chart.js instance on a canvas
type ChartProps = {
  type: keyof ChartTypeRegistry;
  data: any; // Chart.js data object
  options?: any; // Chart.js options object
  className?: string;
};

export const Chart = ({ type, data, options, className }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chartInstance: ChartJS | null = null;
    if (canvasRef.current) {
      chartInstance = new ChartJS(canvasRef.current, {
        type,
        data,
        options,
      });
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} className={className} />;
};

// Simple container for your charts if needed
export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

// Convenience components for specific chart types

// Bar chart component
export const ChartBar = (props: Omit<ChartProps, "type">) => {
  return <Chart type="bar" {...props} />;
};

// Doughnut chart component (for recyclable, non recyclable, and expired)
export const ChartDoughnut = (props: Omit<ChartProps, "type">) => {
  return <Chart type="doughnut" {...props} />;
};

// Line chart component with arrow annotation
export const ChartLine = (props: Omit<ChartProps, "type">) => {
  return <Chart type="line" {...props} />;
};

// Placeholders for further customization (axes, tooltip, etc.)
export const ChartXAxis = ({ dataKey }: { dataKey: string }) => {
  return <div>{dataKey}</div>;
};

export const ChartYAxis = () => {
  return <div>YAxis</div>;
};

export const ChartTooltip = () => {
  return <div>Tooltip</div>;
};

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
  const chartData = {
    labels: expiringData.map(d => d.day),
    datasets: [
      {
        label: 'Expiring Products',
        data: expiringData.map(d => d.count),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Products</CardTitle>
        <CardDescription>Products expiring in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartBar data={chartData} options={chartOptions} className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}
