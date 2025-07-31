'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Calendar, 
  Camera, 
  MessageSquare,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash,
  Upload,
  QrCode,
  Share2,
  ExternalLink,
  FolderOpen,
  Image,
  Home
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import type { Event, Photo } from "@/lib/database";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States for event creation/editing
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventAccessCode, setEventAccessCode] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  
  // States for photo management
  const [selectedPhotoTab, setSelectedPhotoTab] = useState("homepage");
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState("");

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/stats");
      return response.json();
    },
  });

  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/admin/events'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/events");
      return response.json() as Promise<Event[]>;
    },
  });

  // Fetch photos for homepage
  const { data: homepagePhotos = [], isLoading: homepagePhotosLoading } = useQuery({
    queryKey: ['/api/admin/photos/homepage'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/photos/homepage");
      return response.json() as Promise<Photo[]>;
    },
  });

  // Fetch photos for selected event
  const { data: eventPhotos = [], isLoading: eventPhotosLoading } = useQuery({
    queryKey: ['/api/admin/photos/event', selectedEventForPhotos],
    queryFn: async () => {
      if (!selectedEventForPhotos) return [];
      const response = await apiRequest("GET", `/api/events/${selectedEventForPhotos}/photos`);
      return response.json() as Promise<Photo[]>;
    },
    enabled: !!selectedEventForPhotos,
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      resetEventForm();
      setIsCreateEventOpen(false);
      toast({
        title: "Event Berhasil Dibuat!",
        description: "Event baru telah ditambahkan dengan QR code dan link share.",
      });
    },
    onError: (error: any) => {
      console.error('Create event error:', error);
      toast({
        title: "Gagal Membuat Event",
        description: error?.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...eventData }: any) => {
      const response = await apiRequest("PUT", `/api/admin/events/${id}`, eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      resetEventForm();
      setEditingEvent(null);
      toast({
        title: "Event Berhasil Diupdate!",
        description: "Perubahan telah disimpan.",
      });
    },
    onError: (error: any) => {
      console.error('Update event error:', error);
      toast({
        title: "Gagal Update Event",
        description: error?.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/events/${eventId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Event Berhasil Dihapus!",
        description: "Event dan semua datanya telah dihapus.",
      });
    },
    onError: (error: any) => {
      console.error('Delete event error:', error);
      toast({
        title: "Gagal Hapus Event",
        description: error?.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Upload homepage photo mutation
  const uploadHomepagePhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('albumName', 'homepage');
      
      const response = await fetch('/api/admin/photos/homepage', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/homepage'] });
      toast({
        title: "Foto Homepage Berhasil Diupload!",
        description: "Foto telah ditambahkan ke galeri homepage.",
      });
    },
    onError: (error: any) => {
      console.error('Upload homepage photo error:', error);
      toast({
        title: "Upload Gagal",
        description: error?.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/photos/${photoId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/homepage'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/event', selectedEventForPhotos] });
      toast({
        title: "Foto Berhasil Dihapus!",
        description: "Foto telah dihapus dari galeri.",
      });
    },
    onError: (error: any) => {
      console.error('Delete photo error:', error);
      toast({
        title: "Gagal Hapus Foto",
        description: error?.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const resetEventForm = () => {
    setEventName("");
    setEventDate("");
    setEventAccessCode("");
    setIsPremium(false);
  };

  const handleCreateEvent = () => {
    if (!eventName.trim() || !eventDate.trim()) {
      toast({
        title: "Informasi Kurang",
        description: "Mohon isi nama dan tanggal event.",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate({
      name: eventName.trim(),
      date: eventDate,
      accessCode: eventAccessCode.trim() || "GUEST",
      isPremium,
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !eventName.trim() || !eventDate.trim()) {
      toast({
        title: "Informasi Kurang",
        description: "Mohon isi nama dan tanggal event.",
        variant: "destructive",
      });
      return;
    }

    updateEventMutation.mutate({
      id: editingEvent.id,
      name: eventName.trim(),
      date: eventDate,
      accessCode: eventAccessCode.trim() || "GUEST",
      isPremium,
    });
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventDate(event.date);
    setEventAccessCode(event.access_code);
    setIsPremium(event.is_premium);
    setIsCreateEventOpen(true);
  };

  const handleHomepagePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive",
        });
        return;
      }
      uploadHomepagePhotoMutation.mutate(file);
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin!",
      description: `${type} telah disalin ke clipboard.`,
    });
  };

  if (statsLoading || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-ivory">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wedding-gold mb-2">
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">
            Kelola event dan monitoring aktivitas platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Event</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Foto</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPhotos || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesan</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Event
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Foto
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analitik
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manajemen Event</CardTitle>
                <Button 
                  onClick={() => {
                    resetEventForm();
                    setEditingEvent(null);
                    setIsCreateEventOpen(true);
                  }}
                  className="bg-wedding-gold hover:bg-wedding-gold/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Event Baru
                </Button>
              </CardHeader>
              <CardContent>
                {/* Create/Edit Event Form */}
                {isCreateEventOpen && (
                  <Card className="mb-6 border-wedding-gold/20">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {editingEvent ? "Edit Event" : "Buat Event Baru"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="eventName">Nama Event</Label>
                          <Input
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Masukkan nama event"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventDate">Tanggal Event</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="accessCode">Kode Akses</Label>
                          <Input
                            id="accessCode"
                            value={eventAccessCode}
                            onChange={(e) => setEventAccessCode(e.target.value.toUpperCase())}
                            placeholder="GUEST (default)"
                            className="uppercase"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isPremium"
                            checked={isPremium}
                            onChange={(e) => setIsPremium(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="isPremium">Event Premium</Label>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                          disabled={createEventMutation.isPending || updateEventMutation.isPending}
                          className="bg-wedding-gold hover:bg-wedding-gold/90 text-white"
                        >
                          {createEventMutation.isPending || updateEventMutation.isPending ? (
                            <>
                              <LoadingSpinner />
                              <span className="ml-2">
                                {editingEvent ? "Updating..." : "Creating..."}
                              </span>
                            </>
                          ) : (
                            editingEvent ? "Update Event" : "Buat Event"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateEventOpen(false);
                            setEditingEvent(null);
                            resetEventForm();
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Events List */}
                <div className="space-y-4">
                  {events.map((event: Event) => (
                    <Card key={event.id} className="border-wedding-gold/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{event.name}</h3>
                              {event.is_premium && (
                                <span className="px-2 py-1 text-xs bg-wedding-gold text-white rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              📅 {new Date(event.date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              🔑 Kode Akses: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{event.access_code}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(event.shareable_link, "Link Share")}
                              >
                                <Share2 className="w-3 h-3 mr-1" />
                                Copy Link
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(event.qr_code, '_blank')}
                              >
                                <QrCode className="w-3 h-3 mr-1" />
                                QR Code
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/event/${event.id}`, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Lihat Event
                              </Button>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditEvent(event)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm('Yakin ingin menghapus event ini? Semua foto dan pesan akan ikut terhapus.')) {
                                  deleteEventMutation.mutate(event.id);
                                }
                              }}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Belum ada event yang dibuat. Buat event pertama Anda!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Foto</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPhotoTab} onValueChange={setSelectedPhotoTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="homepage" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Galeri Homepage
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Galeri Event
                    </TabsTrigger>
                  </TabsList>

                  {/* Homepage Photos */}
                  <TabsContent value="homepage" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Foto Galeri Homepage</h3>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer">
                          <Button className="bg-wedding-gold hover:bg-wedding-gold/90 text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Foto
                          </Button>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleHomepagePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {uploadHomepagePhotoMutation.isPending && (
                      <div className="flex items-center justify-center py-4">
                        <LoadingSpinner />
                        <span className="ml-2 text-sm text-gray-600">Mengupload foto...</span>
                      </div>
                    )}
                    
                    {homepagePhotosLoading ? (
                      <div className="text-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : homepagePhotos.length > 0 ? (
                      <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {homepagePhotos.map((photo: Photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.original_name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  if (confirm('Yakin ingin menghapus foto ini?')) {
                                    deletePhotoMutation.mutate(photo.id);
                                  }
                                }}
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Belum ada foto di galeri homepage. Upload foto pertama Anda!</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Event Photos */}
                  <TabsContent value="events" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Foto Galeri Event</h3>
                      <select
                        value={selectedEventForPhotos}
                        onChange={(e) => setSelectedEventForPhotos(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="">Pilih Event</option>
                        {events.map((event: Event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedEventForPhotos ? (
                      eventPhotosLoading ? (
                        <div className="text-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : eventPhotos.length > 0 ? (
                        <div>
                          {/* Group photos by album */}
                          {["Official", "Private", "Tamu", "Bridesmaid"].map(albumName => {
                            const albumPhotos = eventPhotos.filter((photo: Photo) => photo.album_name === albumName);
                            if (albumPhotos.length === 0) return null;
                            
                            return (
                              <div key={albumName} className="mb-8">
                                <h4 className="text-md font-semibold mb-4 text-wedding-gold">
                                  Album {albumName} ({albumPhotos.length} foto)
                                </h4>
                                <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
                                  {albumPhotos.map((photo: Photo) => (
                                    <div key={photo.id} className="relative group">
                                      <img
                                        src={photo.url}
                                        alt={photo.original_name}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                              if (confirm('Yakin ingin menghapus foto ini?')) {
                                                deletePhotoMutation.mutate(photo.id);
                                              }
                                            }}
                                          >
                                            <Trash className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                                        {photo.uploader_name || 'Anonim'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Belum ada foto di event ini.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Pilih event untuk melihat foto-fotonya.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analitik Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Grafik dan statistik akan ditampilkan di sini</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pengaturan aplikasi akan ditampilkan di sini</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 