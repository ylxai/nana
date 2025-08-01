import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Phone, AtSign } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-wedding-gold flex items-center gap-2">
            <Camera className="w-7 h-7" />
            HafiPortrait
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-wedding-gold">
              Beranda
            </Link>
            <Link href="/#gallery" className="text-gray-600 hover:text-wedding-gold">
              Galeri
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-wedding-gold">
              Harga
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-wedding-gold">
              Kontak
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              asChild
              className="bg-wedding-gold hover:bg-wedding-gold/90"
            >
              <Link href="/admin">
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}