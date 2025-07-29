import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Upload, 
  MessageSquare, 
  FolderOpen, 
  Play, 
  FileVideo,
  Check,
  Award
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Event Creation",
    description: "Set up your celebration album in under 10 seconds. Just add a name and date – we handle the rest.",
    benefits: [
      "Auto-generated QR codes",
      "Shareable links",
      "No guest registration required"
    ]
  },
  {
    icon: Upload,
    title: "Guest-Friendly Uploads",
    description: "Simple drag-and-drop interface that works perfectly on any device. No apps needed.",
    benefits: [
      "Mobile-optimized interface",
      "Real-time progress bars",
      "Bulk upload support"
    ]
  },
  {
    icon: MessageSquare,
    title: "Digital Guestbook",
    description: "Beautiful message wall where guests can leave heartfelt notes alongside their photos.",
    benefits: [
      "Speech bubble design",
      "Heart reactions",
      "Timestamp display"
    ]
  },
  {
    icon: FolderOpen,
    title: "Multi-Album Support",
    description: "Organize photos into separate albums like \"Ceremony\", \"Reception\", and \"After Party\".",
    benefits: [
      "Tabbed interface",
      "Custom cover images",
      "Privacy controls"
    ]
  },
  {
    icon: Play,
    title: "Wedding Slideshow",
    description: "Auto-rotating gallery with beautiful fade transitions. Perfect for displaying during receptions.",
    benefits: [
      "Fullscreen mode",
      "Customizable timing",
      "Music sync (Premium)"
    ]
  },
  {
    icon: FileVideo,
    title: "Full Quality Uploads",
    description: "Original resolution guaranteed. Every detail preserved with EXIF data intact.",
    benefits: [
      "EXIF data preserved",
      "Cloud storage included",
      "Download originals anytime"
    ],
    badge: "Original Resolution Guaranteed"
  }
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Everything you need for the perfect celebration album
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From instant event creation to beautiful slideshows, we've thought of everything.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border border-gray-100 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-rose-gold/10 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-rose-gold" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                {feature.badge && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 font-semibold">
                      <Award className="inline mr-2 h-4 w-4" />
                      {feature.badge}
                    </p>
                  </div>
                )}
                
                <ul className="text-sm text-gray-500 space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
