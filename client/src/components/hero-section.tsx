import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, QrCode, Users, Upload, BarChart3, Camera } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";
import type { Event } from "@shared/schema";

export default function HeroSection() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();

  const createEventMutation = useMutation({
    mutationFn: async (data: { name: string; date: string }) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json() as Promise<Event>;
    },
    onSuccess: (event) => {
      toast({
        title: "Event Created Successfully!",
        description: `Your event "${event.name}" is ready. Redirecting to your event page.`,
      });
      // Navigate to the event page
      setTimeout(() => {
        setLocation(`/event/${event.id}`);
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateEvent = () => {
    if (!eventName.trim() || !eventDate) {
      toast({
        title: "Missing Information",
        description: "Please enter both event name and date.",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate({
      name: eventName.trim(),
      date: eventDate,
    });
  };

  return (
    <section className="hero-gradient pt-24 pb-16 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Your photos.<br />
              Your guests.<br />
              <span className="text-rose-gold">One perfect album.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              No apps. No fuss. Just memories. Create your celebration album in seconds and let guests upload their favorite moments.
            </p>

            {/* Quick Event Creation Form */}
            <Card className="p-8 mb-8 max-w-md mx-auto lg:mx-0 shadow-xl">
              <CardContent className="p-0">
                <h3 className="text-2xl font-semibold mb-4 text-center">Create Event in 10 Seconds</h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Event Name (e.g., Sarah & Tom's Wedding)"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  />
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  />
                  <Button
                    onClick={handleCreateEvent}
                    disabled={createEventMutation.isPending}
                    className="w-full bg-rose-gold text-white hover:bg-deep-rose gentle-pulse"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {createEventMutation.isPending ? "Creating..." : "Create My Album"}
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                  <QrCode className="h-8 w-8 text-rose-gold mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Instant QR code + shareable link generated</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            {/* Mobile mockup showing the app */}
            <div className="relative max-w-sm mx-auto">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
                alt="Wedding celebration with guests"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>

              {/* Floating UI elements */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold">
                <Users className="inline mr-1 h-4 w-4 text-rose-gold" />
                24 guests uploading
              </div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <Upload className="text-rose-gold h-5 w-5" />
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-rose-gold h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Uploading 12 of 16 photos...</p>
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
              className="bg-rose-gold text-white w-14 h-14 rounded-full shadow-lg float hover:bg-deep-rose"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
