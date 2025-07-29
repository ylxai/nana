import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Heart, Sparkles, ArrowRight, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

const typingTexts = [
  "Wedding Photography",
  "Abadikan Momen Anda"
];

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = typingTexts[currentIndex];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-wedding-ivory via-white to-rose-gold/10 flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23D4A574" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-4 md:left-10 text-rose-gold/20 animate-bounce">
          <Heart className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div className="absolute top-32 right-4 md:right-16 text-rose-gold/20 animate-pulse">
          <Camera className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="absolute bottom-32 left-4 md:left-20 text-rose-gold/20 animate-bounce delay-300">
          <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
        </div>
        <div className="absolute top-1/2 right-2 md:right-8 text-rose-gold/20 animate-pulse delay-700">
          <Heart className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center space-x-2 bg-rose-gold/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Camera className="h-4 w-4 md:h-5 md:w-5 text-rose-gold" />
                  <span className="text-rose-gold font-medium text-xs md:text-sm">HAFIPORTRAIT</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-gold to-deep-rose min-h-[1.2em]">
                    {currentText}
                    <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
                  </span>
                </h1>

                <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                  Mengabadikan setiap momen berharga pernikahan Anda dengan sentuhan artistik dan profesional. 
                  Ciptakan kenangan indah yang akan dikenang selamanya.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-rose-gold to-deep-rose text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                >
                  <Heart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Lihat Portfolio
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                >
                  <Camera className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Konsultasi Gratis
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-gray-200 mx-4 lg:mx-0">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-rose-gold">100+</div>
                  <div className="text-xs md:text-sm text-gray-600">Happy Couples</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-rose-gold">500+</div>
                  <div className="text-xs md:text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-rose-gold">5+</div>
                  <div className="text-xs md:text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative mt-8 lg:mt-0 px-4 lg:px-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/20 to-deep-rose/20 rounded-2xl md:rounded-3xl transform rotate-3 md:rotate-6"></div>
                <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/5] bg-gradient-to-br from-rose-gold/10 to-deep-rose/10 flex items-center justify-center">
                      <div className="text-center space-y-3 md:space-y-4 p-4">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-rose-gold/20 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="h-8 w-8 md:h-12 md:w-12 text-rose-gold" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-800">Portfolio Preview</h3>
                          <p className="text-sm md:text-base text-gray-600">Lihat hasil karya terbaik kami</p>
                          <Button 
                            variant="outline" 
                            className="border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white text-sm md:text-base"
                          >
                            <Play className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                            Play Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-2 md:p-4 animate-bounce">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                  <span className="text-xs md:text-sm font-medium">Premium Quality</span>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 md:-bottom-6 md:-left-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-2 md:p-4 animate-pulse">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  <span className="text-xs md:text-sm font-medium">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}