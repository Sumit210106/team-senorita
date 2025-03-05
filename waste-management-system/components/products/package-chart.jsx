import React from "react";
import Image from "next/image";
import Link from "next/link";

const DeliveryBagsPreview = () => {
  // Mock data for standard delivery bags
  const standardBags = [
    { id: 1, name: "Extra Small Bag", weight: "Up to 500 gm", volume: "650 ml", image: "/api/placeholder/400/400" },
    { id: 2, name: "Small Bag", weight: "Up to 1 kg", volume: "1.2 liters", image: "/api/placeholder/400/400" },
    { id: 3, name: "Medium Bag", weight: "Up to 2 kgs", volume: "2.4 liters", image: "/api/placeholder/400/400" },
    { id: 4, name: "Large Bag", weight: "Up to 5 kgs", volume: "5.7 liters", image: "/api/placeholder/400/400" },
  ];

  // Mock data for specialized delivery bags
  const specializedBags = [
    { id: 6, name: "Insulated Bag", description: "Temperature-controlled for food delivery", image: "/api/placeholder/400/400" },
    { id: 7, name: "Waterproof Bag", description: "Perfect for rainy weather deliveries", image: "/api/placeholder/400/400" },
    { id: 8, name: "Secure Lock Bag", description: "Enhanced security for valuable items", image: "/api/placeholder/400/400" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 flex items-center border-b border-gray-800">
          <div className="w-8 h-8 bg-green-500 flex items-center justify-center rounded-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold">blinkit</h1>
        </div>
        
        {/* Sidebar Links */}
        <nav className="flex-1">
          {/* <Link href="/" className="flex items-center text-gray-300 hover:bg-gray-800 px-4 py-2.5 mx-2 rounded-md cursor-pointer">
            🏠 Dashboard
          </Link> */}
          <Link href="/delivery-bags" className="flex items-center bg-gray-800 text-white px-4 py-2.5 mx-2 rounded-md mt-1 cursor-pointer">
            🎒 Delivery Bags
          </Link>
          {/* <Link href="/analytics" className="flex items-center text-gray-300 hover:bg-gray-800 px-4 py-2.5 mx-2 rounded-md mt-1 cursor-pointer">
            📊 Analytics
          </Link> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Delivery Bags</h1>
          <input type="text" placeholder="Search..." className="bg-gray-800 text-gray-300 rounded-md py-1.5 px-4 w-64 focus:outline-none" />
        </header>

        {/* Bag Categories */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Standard Bags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardBags.map((bag) => (
              <div key={bag.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <Image src={bag.image} alt={bag.name} width={200} height={200} className="rounded-md mx-auto" />
                <h3 className="text-white mt-2">{bag.name}</h3>
                <p className="text-gray-400 text-sm">{bag.weight} • {bag.volume}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Specialized Bags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializedBags.map((bag) => (
              <div key={bag.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <Image src={bag.image} alt={bag.name} width={200} height={200} className="rounded-md mx-auto" />
                <h3 className="text-white mt-2">{bag.name}</h3>
                <p className="text-gray-400 text-sm">{bag.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DeliveryBagsPreview;
