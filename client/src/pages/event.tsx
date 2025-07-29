import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  QrCode, 
  Share2, 
  Heart,
  Download,
  Play,
  Pause,
  Users,
  MessageSquare,
  Calendar,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, Photo, Message } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function EventPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploaderName, setUploaderName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("Main");
  const [guestName, setGuestName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSlideshow, setIsSlideshow] = useState(false);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['/api/events', id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/events/${id}`);
      return response.json() as Promise<Event>;
    },
    enabled: !!id,
  });

  // Fetch event photos
  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: ['/api/events', id, 'photos'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/events/${id}/photos`);
      return response.json() as Promise<Photo[]>;
    },
    enabled: !!id,
  });

  // Fetch event messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/events', id, 'messages'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/events/${id}/messages`);
      return response.json() as Promise<Message[]>;
    },
    enabled: !!id,
  });

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('uploaderName', uploaderName || 'Anonymous');
      formData.append('albumName', selectedAlbum);

      const response = await fetch(`/api/events/${id}/photos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events', id, 'photos'] });
      toast({
        title: "Photo Uploaded!",
        description: "Your photo has been added to the album.",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Message submission mutation
  const addMessageMutation = useMutation({
    mutationFn: async (data: { guestName: string; message: string }) => {
      const response = await apiRequest("POST", `/api/events/${id}/messages`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events', id, 'messages'] });
      setGuestName("");
      setMessageText("");
      toast({
        title: "Message Posted!",
        description: "Your message has been added to the guestbook.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post message.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        uploadPhotoMutation.mutate(file);
      });
    }
  };

  const handleAddMessage = () => {
    if (!guestName.trim() || !messageText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and message.",
        variant: "destructive",
      });
      return;
    }

    addMessageMutation.mutate({
      guestName: guestName.trim(),
      message: messageText.trim(),
    });
  };

  const shareEvent = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.name,
        text: "Check out photos from this celebration!",
        url: event.shareableLink,
      });
    } else if (event) {
      navigator.clipboard.writeText(event.shareableLink);
      toast({
        title: "Link Copied!",
        description: "Share this link with your guests.",
      });
    }
  };

  // Get unique albums
  const albumsSet = new Set(photos.map(photo => photo.albumName));
  const albums = Array.from(albumsSet).filter(Boolean);
  if (albums.length === 0) albums.push("Main");

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-wedding-ivory flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-wedding-ivory flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-ivory">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-rose-gold/20 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(event.date).toLocaleDateString()}
                <Clock className="h-4 w-4 ml-4 mr-1" />
                {photos.length} photos
                <Users className="h-4 w-4 ml-4 mr-1" />
                {messages.length} messages
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={shareEvent}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(event.qrCode, '_blank')}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="slideshow">Slideshow</TabsTrigger>
                <TabsTrigger value="guestbook">Guestbook</TabsTrigger>
              </TabsList>

              <TabsContent value="photos" className="space-y-6">
                {/* Album tabs */}
                {albums.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {albums.map(album => (
                      <Badge
                        key={album}
                        variant={selectedAlbum === album ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedAlbum(album || "Main")}
                      >
                        {album}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Photo grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {photos
                    .filter(photo => photo.albumName === selectedAlbum)
                    .map((photo, index) => (
                    <div key={photo.id} className="photo-hover rounded-lg overflow-hidden bg-white shadow-sm">
                      <img
                        src={photo.url}
                        alt={photo.originalName}
                        className="w-full h-48 object-cover transition-transform duration-300"
                      />
                      <div className="p-3">
                        <p className="text-xs text-gray-500">
                          by {photo.uploaderName || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {photosLoading && (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="slideshow" className="space-y-6">
                {photos.length > 0 ? (
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <img
                      src={photos[0]?.url}
                      alt="Slideshow"
                      className="w-full h-96 object-contain"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Button
                        variant="secondary"
                        onClick={() => setIsSlideshow(!isSlideshow)}
                      >
                        {isSlideshow ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Badge className="bg-black/50 text-white">
                        1 of {photos.length}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No photos yet. Upload some photos to start the slideshow!
                  </div>
                )}
              </TabsContent>

              <TabsContent value="guestbook" className="space-y-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{message.guestName}</h4>
                          <p className="text-gray-600 mt-1">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(message.createdAt!).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center text-red-500">
                          <Heart className="h-4 w-4 mr-1" />
                          {message.hearts}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {messagesLoading && (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Photos */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-rose-gold" />
                  Upload Photos
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Your name (optional)"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                />
                
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {albums.map(album => (
                    <option key={album} value={album || "Main"}>{album || "Main"}</option>
                  ))}
                </select>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag photos here
                    </p>
                  </label>
                </div>

                {uploadPhotoMutation.isPending && (
                  <div className="text-center">
                    <LoadingSpinner className="text-rose-gold" />
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Message */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-rose-gold" />
                  Leave a Message
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
                <Textarea
                  placeholder="Write a heartfelt message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddMessage}
                  disabled={addMessageMutation.isPending}
                  className="w-full bg-rose-gold text-white hover:bg-deep-rose"
                >
                  {addMessageMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  Post Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}