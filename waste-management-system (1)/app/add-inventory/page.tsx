import { Addinventory } from "@/components/waste/inventory-add-form"
import { WasteForm } from "@/components/waste/waste-form"


export default function Modify_inventory() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="w-full max-w-full"> {/* Adjust the max-width as needed */}
        {/* <WasteForm /> */}
        <br />
        <Addinventory />
      </div>
    </div>
  )
}