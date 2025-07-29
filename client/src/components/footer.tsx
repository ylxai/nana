import { Camera, Heart, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Demo", "API"]
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "FAQ", "Status"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Privacy", "Terms"]
  }
];

export default function Footer() {
  return (
    <>
      {/* Footer CTA */}
      <section className="py-20 bg-rose-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to create your perfect album?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have captured their special moments with Wedibox. Start your free event in seconds.
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-gold px-8 py-4 text-lg hover:bg-gray-50 gentle-pulse"
          >
            <Heart className="mr-2 h-5 w-5" />
            Create My Event Now
          </Button>
          <p className="text-white/80 mt-4">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-8 w-8 text-rose-gold" />
                <h3 className="text-2xl font-bold">Wedibox</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Relive every moment in original quality. The easiest way to collect and share celebration photos.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-rose-gold p-0">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-rose-gold p-0">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-rose-gold p-0">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white">
                        {link}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 Wedibox. All rights reserved. Made with ❤️ for celebrations everywhere.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
