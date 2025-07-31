
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Heart, Eye, ZoomIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Wedding Ceremony",
    category: "Wedding"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Romantic Portrait",
    category: "Pre-Wedding"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Reception Party",
    category: "Wedding"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Couple Session",
    category: "Pre-Wedding"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Outdoor Wedding",
    category: "Wedding"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    title: "Family Portrait",
    category: "Family"
  }
];

const categories = ["All", "Wedding", "Pre-Wedding", "Family"];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-wedding-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Galeri Foto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Koleksi foto-foto terbaik dari berbagai event
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Gallery items would go here */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
