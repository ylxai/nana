'use client';

import { Button } from "@/components/ui/button"; 
import { Camera, Heart, Share2 } from "lucide-react";
import { motion, Easing } from "framer-motion"; // Impor Easing

export default function HeroSection() {
  // Definisikan easing sebagai variabel dengan tipe Easing
  const easeOutCubicBezier: Easing = [0, 0, 0.58, 1];

  // Varian animasi untuk teks dan tombol
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutCubicBezier } }, // Gunakan variabel easing
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutCubicBezier, delay: 0.4 } }, // Gunakan variabel easing
  };

  const iconCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: 90 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: easeOutCubicBezier, // Gunakan variabel easing
        delay: 0.6 + i * 0.2, // Delay berurutan untuk setiap kartu
      },
    }),
  };

  return (
    <section className="bg-gradient-to-br from-wedding-ivory to-wedding-rose py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Abadikan Momen
            <span className="text-wedding-gold block">Terindah Anda</span>
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...textVariants.visible.transition, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Platform berbagi foto untuk event spesial Anda. Biarkan tamu 
            mengabadikan setiap momen berharga dan berbagi kebahagiaan bersama.
          </motion.p>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              asChild // Tambahkan ini agar Link bekerja dengan Button
              size="lg" 
              className="bg-wedding-gold hover:bg-wedding-gold/90"
            >
              <a href="#contact"> {/* Ganti dengan tag <a> dan arahkan ke #contact */}
                <Camera className="w-5 h-5 mr-2" />
                Hubungi Kami {/* Ganti teks CTA */}
              </a>
            </Button>
            {/* Tombol Lihat Demo (jika Anda ingin mempertahankannya) */}
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bungkus setiap kartu ikon dengan motion.div dan gunakan custom prop 'i' */}
            {[
              { icon: Camera, title: "Upload Mudah", description: "Tamu dapat langsung upload foto melalui smartphone" },
              { icon: Share2, title: "Berbagi Instan", description: "Bagikan momen spesial secara real-time" },
              { icon: Heart, title: "Kenangan Abadi", description: "Simpan semua foto dalam satu tempat" }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={iconCardVariants}
                initial="hidden"
                animate="visible"
                custom={i} // Teruskan indeks sebagai custom prop
                className="text-center"
              >
                <item.icon className="w-12 h-12 mx-auto text-wedding-gold mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}