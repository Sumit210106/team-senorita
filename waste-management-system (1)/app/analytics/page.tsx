import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { SalesPrediction } from "@/components/analytics/sales-prediction"
import { WasteAnalytics } from "@/components/analytics/waste-analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsHeader />
      <div className="flex-1 p-6 space-y-6">
        <SalesPrediction />
        <WasteAnalytics />
      </div>
    </div>
  )
}

