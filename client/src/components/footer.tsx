
import { Camera, Phone, Instagram, Mail, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-rose-gold" />
              <h3 className="text-2xl font-playfair font-bold">Hafiportrait</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Mengabadikan setiap momen berharga pernikahan Anda dengan sentuhan artistik dan profesional.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/hafiportrait" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-gold transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="tel:+6289570503193"
                className="text-gray-400 hover:text-rose-gold transition-colors"
              >
                <Phone className="h-6 w-6" />
              </a>
              <a 
                href="mailto:hafiportrait@gmail.com"
                className="text-gray-400 hover:text-rose-gold transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-rose-gold transition-colors">Wedding Photography</a></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Pre-Wedding Shoot</a></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Engagement Photography</a></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Family Portrait</a></li>
              <li><a href="#" className="hover:text-rose-gold transition-colors">Event Documentation</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#gallery" className="hover:text-rose-gold transition-colors">Galeri</a></li>
              <li><a href="#pricing" className="hover:text-rose-gold transition-colors">Paket Harga</a></li>
              <li><a href="#events" className="hover:text-rose-gold transition-colors">Event</a></li>
              <li><a href="#contact" className="hover:text-rose-gold transition-colors">Kontak</a></li>
              <li><a href="/admin" className="hover:text-rose-gold transition-colors">Admin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-rose-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Telepon</p>
                  <a href="tel:+6289570503193" className="hover:text-rose-gold transition-colors">
                    +62 895 700503193
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Instagram className="h-5 w-5 text-rose-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <a 
                    href="https://instagram.com/hafiportrait" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-rose-gold transition-colors"
                  >
                    @hafiportrait
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-rose-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hafiportrait@gmail.com" className="hover:text-rose-gold transition-colors">
                    hafiportrait@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Hafiportrait. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for capturing beautiful moments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
