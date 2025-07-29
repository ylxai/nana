
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Heart, Award, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  
  // Typing animation state
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const phrases = ["Wedding Photography", "Abadikan Momen Anda"];
  
  useEffect(() => {
    const currentPhraseText = phrases[currentPhrase];
    
    if (currentIndex < currentPhraseText.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentPhraseText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // Pause at end of phrase
      const timeout = setTimeout(() => {
        if (currentPhrase < phrases.length - 1) {
          setCurrentPhrase(currentPhrase + 1);
          setCurrentIndex(0);
          setTypedText("");
        } else {
          // Reset to first phrase
          setCurrentPhrase(0);
          setCurrentIndex(0);
          setTypedText("");
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentPhrase]);

  return (
    <section className="hero-gradient pt-20 pb-16 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/10 via-transparent to-deep-rose/10"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-grid-pattern"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* 3D Typing Text */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                <span className="block text-3xl md:text-4xl lg:text-5xl text-rose-gold mb-2">Hafiportrait</span>
                <span className="typing-3d-text relative inline-block">
                  {typedText}
                  <span className="typing-cursor absolute top-0 right-0 animate-pulse">|</span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                Profesional wedding photographer yang mengabadikan setiap momen berharga dalam hidup Anda dengan sentuhan artistik dan kualitas terbaik.
              </p>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                <Camera className="h-8 w-8 text-rose-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Professional</p>
              </div>
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
                <Heart className="h-8 w-8 text-rose-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Romantic</p>
              </div>
              <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg col-span-2 md:col-span-1">
                <Award className="h-8 w-8 text-rose-gold mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Award Winner</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-rose-gold text-white hover:bg-deep-rose px-8 py-3 text-lg font-semibold shadow-lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Camera className="mr-2 h-5 w-5" />
                Hubungi Kami
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white px-8 py-3 text-lg font-semibold"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Lihat Portfolio
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Hero Image */}
            <div className="relative max-w-lg mx-auto">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
                  alt="Hafiportrait Wedding Photography"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-rose-gold" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">500+</p>
                    <p className="text-xs text-gray-600">Happy Couples</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-rose-gold" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">5 Years</p>
                    <p className="text-xs text-gray-600">Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button for mobile */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            size="lg"
            className="bg-rose-gold text-white w-14 h-14 rounded-full shadow-lg hover:bg-deep-rose transform hover:scale-110 transition-all"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      )}
    </section>
  );
}
