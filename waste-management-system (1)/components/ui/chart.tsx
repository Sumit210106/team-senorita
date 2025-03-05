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
