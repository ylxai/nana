
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Download } from "lucide-react";

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("semua");

  const categories = [
    { id: "semua", label: "Semua" },
    { id: "wedding", label: "Wedding" },
    { id: "prewedding", label: "Pre-Wedding" },
    { id: "engagement", label: "Engagement" },
    { id: "family", label: "Family" }
  ];

  const photos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "wedding",
      title: "Wedding Ceremony",
      likes: 45
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "prewedding",
      title: "Pre-Wedding Shoot",
      likes: 32
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "wedding",
      title: "Reception",
      likes: 58
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "engagement",
      title: "Engagement Party",
      likes: 27
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "family",
      title: "Family Portrait",
      likes: 41
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      category: "wedding",
      title: "Wedding Details",
      likes: 35
    }
  ];

  const filteredPhotos = selectedCategory === "semua" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Galeri Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi foto-foto terbaik dari berbagai acara yang telah kami dokumentasikan
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-6 py-2 ${
                selectedCategory === category.id
                  ? "bg-rose-gold text-white"
                  : "border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <h3 className="text-xl font-semibold">{photo.title}</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <Heart className="h-4 w-4 mr-2" />
                        {photo.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-rose-gold text-white hover:bg-deep-rose px-8 py-3">
            Lihat Semua Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
