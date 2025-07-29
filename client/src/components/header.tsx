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
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-rose-gold mobile-touch"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`flex items-center space-x-2 text-gray-700 transition-colors ${item.className}`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-50 mt-20 mobile-menu android-chrome-fix ios-safe-area">
            <div className="flex flex-col items-center justify-center h-full space-y-8 text-center mobile-spacing">
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-2xl text-gray-700 hover:text-rose-gold transition-colors font-medium mobile-touch"
              >
                Galeri
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-2xl text-gray-700 hover:text-rose-gold transition-colors font-medium mobile-touch"
              >
                Paket Harga
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className="text-2xl text-gray-700 hover:text-rose-gold transition-colors font-medium mobile-touch"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-2xl text-gray-700 hover:text-rose-gold transition-colors font-medium mobile-touch"
              >
                Kontak
              </button>

              {/* Mobile Contact Info */}
              <div className="space-y-4 pt-8 border-t border-gray-200 w-full max-w-xs">
                {contactItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center justify-center space-x-3 text-gray-700 transition-colors mobile-touch w-full ${item.className}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-lg font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}