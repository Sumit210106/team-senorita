"use client"

import type * as React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

export const Chart = ({
  data,
  children,
  className,
}: { data: any[]; children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartBars = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartBar = ({ value, name, className }: { value: number; name: string; className?: string }) => {
  return <div className={className}></div>
}

export const ChartXAxis = ({ dataKey }: { dataKey: string }) => {
  return <div></div>
}

export const ChartYAxis = () => {
  return <div></div>
}

export const ChartTooltip = () => {
  return <div></div>
}

export const ChartLine = ({ name, dataKey, className }: { name: string; dataKey: string; className?: string }) => {
  return <div className={className}></div>
}

