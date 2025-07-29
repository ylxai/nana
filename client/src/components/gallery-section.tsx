
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const isMobile = useIsMobile();

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-rose-gold/10 px-4 py-2 rounded-full mb-4">
            <Camera className="h-5 w-5 text-rose-gold" />
            <span className="text-rose-gold font-medium">GALERI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold to-deep-rose">Terbaik</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Lihat koleksi foto-foto terbaik kami yang mengabadikan momen berharga
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-rose-gold to-deep-rose text-white shadow-lg"
                    : "border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredImages.map((image) => (
            <Card 
              key={image.id} 
              className="group overflow-hidden card-hover cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ZoomIn className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm text-gray-300">{image.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-rose-gold to-deep-rose text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Eye className="h-5 w-5 mr-2" />
            Lihat Semua Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
