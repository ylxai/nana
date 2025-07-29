import { Check, Camera, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  badge?: string;
  icon: string;
  features: string[];
  popular: boolean;
}

const defaultPlans: PricingPlan[] = [
  {
    id: "akad",
    name: "Paket Akad Nikah",
    price: "IDR 1.300.000",
    badge: "PROMO",
    icon: "👰‍♀️💒",
    features: [
      "1 fotografer",
      "1 hari kerja",
      "40 cetak foto 5R (pilihan)",
      "Album magnetik (tempel)",
      "File foto tanpa batas",
      "Softcopy di flashdisk"
    ],
    popular: false
  },
  {
    id: "wedding",
    name: "Paket Wedding",
    price: "IDR 8.000.000",
    badge: "POPULAR",
    icon: "💍✨",
    features: [
      "2 fotografer",
      "8 jam liputan",
      "200 foto edit profesional",
      "Album premium 40 halaman",
      "USB flashdisk custom",
      "Online gallery selamanya",
      "Video highlight 3-5 menit",
      "Same day edit"
    ],
    popular: true
  },
  {
    id: "platinum",
    name: "Paket Platinum",
    price: "IDR 12.000.000",
    badge: "LUXURY",
    icon: "👑💎",
    features: [
      "3 fotografer + videographer",
      "Full day coverage",
      "Unlimited foto edit",
      "Album premium leather",
      "Cinematic wedding video",
      "Drone footage",
      "Pre-wedding session",
      "Same day edit + highlight"
    ],
    popular: false
  }
];

export default function PricingSection() {
  const plans = defaultPlans;
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you need more storage and features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? "border-2 border-rose-gold bg-gradient-to-br from-rose-gold via-deep-rose to-rose-gold text-white shadow-2xl scale-105" 
                  : "border border-gray-200 hover:border-rose-gold/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`px-4 py-1 font-semibold ${
                    plan.popular 
                      ? "bg-white text-rose-gold" 
                      : "bg-rose-gold text-white"
                  }`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <CardTitle className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-800"}`}>
                  {plan.name}
                </CardTitle>
                <div className={`${plan.popular ? "text-white" : "text-gray-600"}`}>
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className={`space-y-3 mb-8 ${plan.popular ? "text-white" : "text-gray-600"}`}>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
                        plan.popular ? "text-white" : "text-rose-gold"
                      }`} />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    className={`w-full transition-all duration-300 ${
                      plan.popular 
                        ? "bg-white text-rose-gold hover:bg-gray-50 hover:shadow-lg" 
                        : "bg-rose-gold text-white hover:bg-deep-rose hover:shadow-lg"
                    }`}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Pilih Paket
                  </Button>

                  <Button 
                    variant="outline"
                    className={`w-full ${
                      plan.popular 
                        ? "border-white text-white hover:bg-white/10" 
                        : "border-rose-gold text-rose-gold hover:bg-rose-gold/10"
                    }`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Informasi Tambahan</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-rose-gold mb-2">📝 Ketentuan Booking:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• DP 30% untuk konfirmasi booking</li>
                  <li>• Pelunasan H-7 sebelum acara</li>
                  <li>• Reschedule maksimal 2x</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-rose-gold mb-2">🚗 Ketentuan Transport:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gratis dalam kota Bandung</li>
                  <li>• Luar kota dikenakan biaya transport</li>
                  <li>• Konsep outdoor tersedia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}