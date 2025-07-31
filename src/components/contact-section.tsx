
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Siap membantu mewujudkan event impian Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-wedding-gold mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Telepon</h3>
                <p className="text-gray-600">+62 812-3456-7890</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-wedding-gold mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-600">info@hafiportrait.com</p>
              </div>
                    </div>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-wedding-gold mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Lokasi</h3>
                <p className="text-gray-600">Jakarta, Indonesia</p>
                    </div>
                  </div>
            
            <div className="flex items-start space-x-4">
              <MessageCircle className="w-6 h-6 text-wedding-gold mt-1" />
              <div>
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <p className="text-gray-600">+62 812-3456-7890</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
              <CardHeader>
              <CardTitle>Kirim Pesan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Nama" />
                <Input placeholder="Email" />
                  </div>
              <Input placeholder="Subjek" />
              <Textarea placeholder="Pesan Anda" rows={4} />
              <Button className="w-full bg-wedding-gold hover:bg-wedding-gold/90">
                Kirim Pesan
              </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
