import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Michael",
    date: "Married June 2023",
    avatar: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "Wedibox was a game-changer for our wedding! We got photos from guests we never would have seen otherwise. The setup took literally 30 seconds.",
    rating: 5
  },
  {
    name: "Jennifer & David",
    date: "Married August 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "Our guests loved how easy it was to share photos. The QR code on each table made it so simple. We ended up with over 500 amazing photos!",
    rating: 5
  },
  {
    name: "Emma & James",
    date: "Married September 2023",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "The slideshow feature was perfect for our reception. Everyone loved seeing their photos appear in real-time on the big screen!",
    rating: 5
  }
];

export default function TestimonialsSection() {
  // Duplicate testimonials for seamless scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Stories from Happy Couples
          </h2>
          <p className="text-xl text-gray-600">
            See how Wedibox made their special days even more memorable
          </p>
        </div>

        {/* Auto-scrolling testimonials */}
        <div className="relative">
          <div className="testimonial-scroll flex space-x-8">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
