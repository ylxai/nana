import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Paket Akad Nikah",
      price: "1.300.000",
      features: [
        "1 fotografer",
        "1 hari kerja",
        "40 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk"
      ]
    },
    {
      name: "Paket Resepsi",
      price: "1.800.000",
      features: [
        "1 fotografer & 1 asisten fotografer",
        "1 hari kerja",
        "40 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 cetak besar 14R + frame"
      ]
    },
    {
      name: "Paket Akad Nikah", // Paket Akad Nikah kedua
      price: "2.000.000",
      features: [
        "1 fotografer & 1 asisten fotografer",
        "1 hari kerja",
        "80 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 cetak besar 14R + frame"
      ]
    },
    {
      name: "Paket Resepsi", // Paket Resepsi kedua
      price: "2.300.000",
      features: [
        "1 fotografer & 1 asisten fotografer",
        "1 hari kerja",
        "80 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 cetak besar 14R + frame"
      ]
    },
    {
      name: "Akad Nikah & Resepsi",
      price: "3.000.000",
      features: [
        "1 fotografer & 1 asisten fotografer",
        "2 hari kerja",
        "80 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 cetak besar 14R + frame"
      ]
    },
    {
      name: "Akad Nikah & Resepsi", // Paket gabungan kedua
      price: "4.000.000",
      features: [
        "1 fotografer & 1 asisten fotografer",
        "2 hari kerja",
        "80 cetak foto 5R (pilihan)",
        "Album magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 Photo Box",
        "Cetak besar 14R Jumbo + frame"
      ]
    },
    {
      name: "Akad Nikah & Resepsi", // Paket gabungan ketiga
      price: "6.000.000",
      features: [
        "2 fotografer & 1 asisten fotografer",
        "2 hari kerja",
        "120 cetak foto 5R (pilihan)",
        "Album hard cover magnetik (tempel)",
        "File foto tanpa batas",
        "Softcopy di flashdisk",
        "1 cetak besar 16R Jumbo + frame"
      ],
      popular: true // Contoh: Menandai paket termahal sebagai terpopuler
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Paket Harga
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan event Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-wedding-gold border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-wedding-gold text-white px-4 py-1 rounded-full text-sm font-medium">
                    Terpopuler
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-wedding-gold">
                  IDR {plan.price} {/* Tambahkan prefix IDR */}
                  <span className="text-lg font-normal text-gray-600">/event</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-wedding-gold hover:bg-wedding-gold/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Pilih Paket
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}