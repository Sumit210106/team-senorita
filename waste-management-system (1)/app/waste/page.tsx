import { WasteHeader } from "@/components/waste/waste-header"
import { WasteTable } from "@/components/waste/waste-table"
import { WasteForm } from "@/components/waste/waste-form"

export default function WastePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <WasteHeader />
      <div className="flex-1 p-6 space-y-6">
      <WasteTable />

        <WasteForm />
      </div>
    </div>
  )
}

