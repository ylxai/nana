
import { Camera, Menu, X, Phone, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

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
    setIsMobileMenuOpen(false);
  };

  const contactItems = [
    {
      icon: Phone,
      label: "+62 895 700503193",
      href: "tel:+6289570503193",
      className: "hover:text-green-600"
    },
    {
      icon: Instagram,
      label: "@hafiportrait",
      href: "https://instagram.com/hafiportrait",
      className: "hover:text-pink-600"
    }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-rose-gold/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-rose-gold" />
            <h1 className="text-2xl font-playfair font-bold text-gray-800">Hafiportrait</h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-gray-700 hover:text-rose-gold transition-colors font-medium"
            >
              Galeri
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-rose-gold transition-colors font-medium"
            >
              Paket Harga
            </button>
            <button
              onClick={() => scrollToSection('events')}
              className="text-gray-700 hover:text-rose-gold transition-colors font-medium"
            >
              Event
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-rose-gold transition-colors font-medium"
            >
              Kontak
            </button>
          </div>

          {/* Contact Icons Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`flex items-center space-x-2 text-gray-600 transition-colors ${item.className}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-rose-gold ml-4"
              onClick={() => setLocation('/admin')}
            >
              Admin
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-rose-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-rose-gold/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left py-3 text-gray-700 hover:text-rose-gold transition-colors font-medium"
              >
                Galeri
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left py-3 text-gray-700 hover:text-rose-gold transition-colors font-medium"
              >
                Paket Harga
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className="block w-full text-left py-3 text-gray-700 hover:text-rose-gold transition-colors font-medium"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-3 text-gray-700 hover:text-rose-gold transition-colors font-medium"
              >
                Kontak
              </button>
              
              {/* Mobile Contact */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {contactItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center space-x-3 py-2 text-gray-600 transition-colors ${item.className}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white"
                  onClick={() => {
                    setLocation('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Admin Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
