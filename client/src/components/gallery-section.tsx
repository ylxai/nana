import { useState } from "react";
import { Button } from "@/components/ui/button";

const galleryTabs = [
  {
    id: "weddings",
    label: "Weddings",
    photos: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    ]
  },
  {
    id: "birthdays",
    label: "Birthdays",
    photos: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    ]
  },
  {
    id: "corporate",
    label: "Corporate",
    photos: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    ]
  }
];

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState("weddings");

  const activeGallery = galleryTabs.find(tab => tab.id === activeTab);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Celebrations of All Kinds
          </h2>
          <p className="text-xl text-gray-600">
            From intimate gatherings to grand celebrations, capture every precious moment
          </p>
        </div>

        {/* Tabbed gallery interface */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-2 inline-flex">
              {galleryTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === tab.id
                      ? "bg-rose-gold text-white hover:bg-deep-rose"
                      : "text-gray-600 hover:text-rose-gold hover:bg-transparent"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {activeGallery?.photos.map((photo, index) => (
              <div key={index} className="photo-hover rounded-xl overflow-hidden">
                <img
                  src={photo}
                  alt={`${activeGallery.label} celebration`}
                  className="w-full h-64 object-cover transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
