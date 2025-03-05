import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { ExpiringProducts } from "@/components/dashboard/expiring-products"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 p-6 space-y-6">
        <DashboardMetrics />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCharts />
          <ExpiringProducts />
        </div>
      </div>
    </div>
  )
}

