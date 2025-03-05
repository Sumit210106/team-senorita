import  DeliveryBagsPreview  from "@/components/products/package-chart"


export default function Modify_inventory() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="w-full max-w-full"> {/* Adjust the max-width as needed */}
        <DeliveryBagsPreview />
        <br />
        {/* <Addinventory /> */}
      </div>
    </div>
  )
}