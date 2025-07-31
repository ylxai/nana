import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-wedding-gold mb-4">
              Hafi Portrait
            </h3>
            <p className="text-gray-300 mb-4">
              Platform berbagi foto terpercaya untuk event dan acara spesial Anda. 
              Abadikan setiap momen berharga bersama orang-orang terkasih.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/#gallery" className="hover:text-wedding-gold">Galeri</Link></li>
              <li><Link href="/#pricing" className="hover:text-wedding-gold">Paket Harga</Link></li>
              <li><Link href="/#features" className="hover:text-wedding-gold">Fitur</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@hafiportrait.com</li>
              <li>WhatsApp: +62 812-3456-7890</li>
              <li>Instagram: @hafiportrait</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Hafi Portrait. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}