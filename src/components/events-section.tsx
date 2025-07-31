
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Camera, MapPin, Clock, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useLocation } from "wouter";
import type { Event } from "@shared/schema";

export default function EventsSection() {
  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Event Terbaru
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat event-event terbaru yang telah menggunakan layanan kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Event cards would go here */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Event akan ditampilkan di sini</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Event akan ditampilkan di sini</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">Event akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </section>
  );
}
