"use client";

import { useState } from "react";
import { ChevronDown, LineChart, Package, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = {
  edible: {
    recyclable: [
      { name: "Paper Bags", weight: "50g", dimensions: "10x5x2cm", volume: "100ml", image: "https://images.unsplash.com/photo-1572377423583-e0469317d0e8?w=500" },
      { name: "Cardboard Box", weight: "150g", dimensions: "20x15x10cm", volume: "3000ml", image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=500" },
    ],
    nonRecyclable: [
      { name: "Plastic Wrap", weight: "5g", dimensions: "30x20cm", volume: "N/A", image: "https://images.unsplash.com/photo-1589324227175-81dbae759e6a?w=500" },
      { name: "Food Container", weight: "75g", dimensions: "15x15x5cm", volume: "1125ml", image: "https://images.unsplash.com/photo-1622178051885-d225b0a48929?w=500" },
    ]
  },
  nonEdible: {
    recyclable: [
      { name: "Glass Bottle", weight: "200g", dimensions: "20x6cm", volume: "750ml", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500" },
      { name: "Metal Can", weight: "100g", dimensions: "12x6cm", volume: "330ml", image: "https://images.unsplash.com/photo-1576705263990-bf687b2da184?w=500" },
    ],
    nonRecyclable: [
      { name: "Plastic Toy", weight: "120g", dimensions: "15x10x5cm", volume: "750ml", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500" },
      { name: "Rubber Band", weight: "2g", dimensions: "5x0.2cm", volume: "N/A", image: "https://images.unsplash.com/photo-1589839741631-2436227c0921?w=500" },
    ]
  },
  wet: [
    { name: "Liquid Soap", weight: "250g", dimensions: "10x5x15cm", volume: "250ml", image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=500" },
    { name: "Shampoo", weight: "400g", dimensions: "8x4x20cm", volume: "400ml", image: "https://images.unsplash.com/photo-1598454444233-9dc334297ee3?w=500" },
  ],
  dry: [
    { name: "Rice", weight: "1kg", dimensions: "20x15x5cm", volume: "1500ml", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500" },
    { name: "Flour", weight: "500g", dimensions: "15x10x5cm", volume: "750ml", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
  ]
};

export default function Product_page() {
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [showInventory, setShowInventory] = useState(false);

  const menuItems = [
    // { icon: Package, label: "Inventory", onClick: () => { setShowInventory(true); setSelectedCategory(""); } },
    // { icon: LineChart, label: "Analysis Report" },
    // { icon: Users, label: "Users" },
    // { icon: Settings, label: "Settings" }
  ];

  const renderItems = () => {
    if (selectedCategory === "edible" || selectedCategory === "nonEdible") {
      const items = categories[selectedCategory][selectedSubCategory] || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video w-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{item.weight}</span>
                  </p>
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Dimensions:</span>
                    <span>{item.dimensions}</span>
                  </p>
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Volume:</span>
                    <span>{item.volume}</span>
                  </p>
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {selectedCategory}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {selectedSubCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedCategory === "wet" || selectedCategory === "dry") {
      const items = categories[selectedCategory] || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video w-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{item.weight}</span>
                  </p>
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Dimensions:</span>
                    <span>{item.dimensions}</span>
                  </p>
                  <p className="text-gray-600 flex items-center justify-between">
                    <span className="font-medium">Volume:</span>
                    <span>{item.volume}</span>
                  </p>
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {selectedCategory}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">
            {/* <span className="text-yellow-400">Blink</span>
            <span className="text-green-500">it</span> */}
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {!showInventory ? (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-6xl font-bold">
              <span className="text-yellow-400">Blink</span>
              <span className="text-green-500">it</span>
            </h1>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Categories */}
            <div className="w-64 bg-white shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedCategory("edible")}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200",
                      selectedCategory === "edible" 
                        ? "bg-green-50 text-green-700 shadow-sm" 
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <span className="font-medium">Edible</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      selectedCategory === "edible" && "transform rotate-180"
                    )} />
                  </button>
                  {selectedCategory === "edible" && (
                    <div className="ml-4 space-y-1 mt-2">
                      <button
                        onClick={() => setSelectedSubCategory("recyclable")}
                        className={cn(
                          "w-full p-2 text-left rounded-lg transition-colors",
                          selectedSubCategory === "recyclable" 
                            ? "bg-green-50 text-green-700" 
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        Recyclable
                      </button>
                      <button
                        onClick={() => setSelectedSubCategory("nonRecyclable")}
                        className={cn(
                          "w-full p-2 text-left rounded-lg transition-colors",
                          selectedSubCategory === "nonRecyclable" 
                            ? "bg-green-50 text-green-700" 
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        Non-Recyclable
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => setSelectedCategory("nonEdible")}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200",
                      selectedCategory === "nonEdible" 
                        ? "bg-green-50 text-green-700 shadow-sm" 
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <span className="font-medium">Non-Edible</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      selectedCategory === "nonEdible" && "transform rotate-180"
                    )} />
                  </button>
                  {selectedCategory === "nonEdible" && (
                    <div className="ml-4 space-y-1 mt-2">
                      <button
                        onClick={() => setSelectedSubCategory("recyclable")}
                        className={cn(
                          "w-full p-2 text-left rounded-lg transition-colors",
                          selectedSubCategory === "recyclable" 
                            ? "bg-green-50 text-green-700" 
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        Recyclable
                      </button>
                      <button
                        onClick={() => setSelectedSubCategory("nonRecyclable")}
                        className={cn(
                          "w-full p-2 text-left rounded-lg transition-colors",
                          selectedSubCategory === "nonRecyclable" 
                            ? "bg-green-50 text-green-700" 
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        Non-Recyclable
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedCategory("wet"); setSelectedSubCategory(""); }}
                  className={cn(
                    "w-full p-3 text-left rounded-lg transition-all duration-200",
                    selectedCategory === "wet" 
                      ? "bg-green-50 text-green-700 shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <span className="font-medium">Wet</span>
                </button>
                <button
                  onClick={() => { setSelectedCategory("dry"); setSelectedSubCategory(""); }}
                  className={cn(
                    "w-full p-3 text-left rounded-lg transition-all duration-200",
                    selectedCategory === "dry" 
                      ? "bg-green-50 text-green-700 shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <span className="font-medium">Dry</span>
                </button>
              </div>
            </div>

            {/* Items Display */}
            <div className="flex-1 p-8 bg-gray-50">
              {renderItems()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}