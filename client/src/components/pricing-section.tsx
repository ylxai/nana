import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const plans = [
  {
    name: "Free Forever",
    price: "$0",
    description: "Perfect for small celebrations",
    features: [
      "Up to 100 photos",
      "1 GB storage",
      "Basic slideshow",
      "Digital guestbook",
      "QR code sharing",
      "30-day album access"
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "$19",
    description: "per event, unlimited storage",
    features: [
      "Unlimited photos & videos",
      "Unlimited storage",
      "Advanced slideshow with music",
      "Multiple album creation",
      "Custom branding",
      "Download all originals",
      "Lifetime album access",
      "Priority support"
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "default" as const,
    popular: true
  }
];

export default function PricingSection() {
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

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular 
                  ? "bg-rose-gold border-2 border-rose-gold shadow-xl" 
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-deep-rose text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : ""}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-800"}`}>
                  {plan.price}
                </div>
                <p className={plan.popular ? "text-white/80" : "text-gray-600"}>
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent>
                <ul className={`space-y-4 mb-8 ${plan.popular ? "text-white" : ""}`}>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular 
                      ? "bg-white text-rose-gold hover:bg-gray-50" 
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.buttonText}
                </Button>

                {/* Storage meter for premium plan */}
                {plan.popular && (
                  <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>Storage used</span>
                      <span>2.4 GB / ∞</span>
                    </div>
                    <Progress value={25} className="bg-white/20" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
