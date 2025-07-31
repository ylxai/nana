import { Button } from "@/components/ui/button"; 
import { Camera, Heart, Share2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-wedding-ivory to-wedding-rose py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Abadikan Momen
            <span className="text-wedding-gold block">Terindah Anda</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform berbagi foto untuk event spesial Anda. Biarkan tamu 
            mengabadikan setiap momen berharga dan berbagi kebahagiaan bersama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-wedding-gold hover:bg-wedding-gold/90"
            >
              <Camera className="w-5 h-5 mr-2" />
              Mulai Event
            </Button>
            <Button 
              variant="outline" 
              size="lg"
            >
              Lihat Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto text-wedding-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Mudah</h3>
              <p className="text-gray-600">Tamu dapat langsung upload foto melalui smartphone</p>
            </div>
            <div className="text-center">
              <Share2 className="w-12 h-12 mx-auto text-wedding-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Berbagi Instan</h3>
              <p className="text-gray-600">Bagikan momen spesial secara real-time</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto text-wedding-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kenangan Abadi</h3>
              <p className="text-gray-600">Simpan semua foto dalam satu tempat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}