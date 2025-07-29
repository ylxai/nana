import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-rose-gold/20">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-rose-gold" />
            <h1 className="text-2xl font-playfair font-bold text-gray-800">Wedibox</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-rose-gold transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-rose-gold transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-600 hover:text-rose-gold transition-colors"
            >
              Stories
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-rose-gold transition-colors"
            >
              FAQ
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-600 hover:text-rose-gold">
              Sign In
            </Button>
            <Button className="bg-rose-gold text-white hover:bg-deep-rose">
              Start Free
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
