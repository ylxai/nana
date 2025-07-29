import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesGrid from "@/components/features-grid";
import DemoSection from "@/components/demo-section";
import GallerySection from "@/components/gallery-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-wedding-ivory">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <DemoSection />
      <GallerySection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
