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
  Home,
  X,
  ChevronLeft,
  ChevronRight,
  Crown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import type { Event, Photo } from "@/lib/database";
import StatsCards from "@/components/admin/StatsCards";
import EventForm, { type EventFormData } from "@/components/admin/EventForm";
import EventList from "@/components/admin/EventList";
import PhotoLightbox from "@/components/photo-lightbox";

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
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isHomepageUploadOpen, setIsHomepageUploadOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null); 
  // States for photo management
  const [selectedPhotoTab, setSelectedPhotoTab] = useState("homepage");
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState("");
  
  // States for official gallery upload
  const [isOfficialUploadOpen, setIsOfficialUploadOpen] = useState(false);
  const [officialPhotoDescription, setOfficialPhotoDescription] = useState("");

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
        description: "Event baru telah ditambahkan ke sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Membuat Event",
        description: "Terjadi kesalahan saat membuat event.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("PUT", `/api/events/${eventData.id}`, eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      resetEventForm();
      setEditingEvent(null);
      toast({
        title: "Event Berhasil Diperbarui!",
        description: "Event telah diperbarui dengan sukses.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Memperbarui Event",
        description: "Terjadi kesalahan saat memperbarui event.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiRequest("DELETE", `/api/events/${eventId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Event Berhasil Dihapus!",
        description: "Event telah dihapus dari sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menghapus Event",
        description: "Terjadi kesalahan saat menghapus event.",
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
      const response = await apiRequest("POST", "/api/admin/photos/homepage", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/homepage'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Foto Berhasil Diupload!",
        description: "Foto telah ditambahkan ke galeri homepage.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Upload Foto",
        description: "Terjadi kesalahan saat mengupload foto.",
        variant: "destructive",
      });
    },
  });

  // Upload official photo mutation
  const uploadOfficialPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('uploaderName', 'Admin');
      formData.append('albumName', 'Official');
      const response = await apiRequest("POST", `/api/events/${selectedEventForPhotos}/photos`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/event', selectedEventForPhotos] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsOfficialUploadOpen(false);
      setOfficialPhotoDescription("");
      toast({
        title: "Foto Official Berhasil Diupload!",
        description: "Foto telah ditambahkan ke galeri official event.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Upload Foto Official",
        description: "Terjadi kesalahan saat mengupload foto official.",
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
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Foto Berhasil Dihapus!",
        description: "Foto telah dihapus dari sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menghapus Foto",
        description: "Terjadi kesalahan saat menghapus foto.",
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
    if (!eventName || !eventDate || !eventAccessCode) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate({
      name: eventName,
      date: eventDate,
      access_code: eventAccessCode,
      is_premium: isPremium,
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !eventName || !eventDate || !eventAccessCode) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    updateEventMutation.mutate({
      id: editingEvent.id,
      name: eventName,
      date: eventDate,
      access_code: eventAccessCode,
      is_premium: isPremium,
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

  const handleOfficialPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive",
        });
        return;
      }
      uploadOfficialPhotoMutation.mutate(file);
    }
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

  const handleSaveEvent = (data: EventFormData & { id?: string }) => {
    // Pastikan ID disertakan saat update
    if (editingEvent && editingEvent.id) {
      updateEventMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleStartEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };
  
  const handleCancelForm = () => {
    setEditingEvent(null);
    setIsEventFormOpen(false);
  };
  
  const handleAddNewClick = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
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
        <StatsCards stats={stats} />

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
                {!isEventFormOpen && ( 
                    <Button onClick={handleAddNewClick} className="bg-wedding-gold hover:bg-wedding-gold/90 text-white">
                        <Plus className="text-black w-4 h-4 mr-2" />
                        Buat Event Baru
                    </Button>
                )}
              </CardHeader>
              <CardContent>
                {/* Tampilkan form jika isEventFormOpen adalah true */}
                {isEventFormOpen && (
                  <EventForm
                    editingEvent={editingEvent}
                    onSave={handleSaveEvent}
                    onCancel={handleCancelForm}
                    isSaving={createEventMutation.isPending || updateEventMutation.isPending}
                  />
                )}
                
                {/* Tampilkan daftar event */}
                <EventList
                  events={events}
                  onEdit={handleStartEdit}
                  onDelete={(eventId) => deleteEventMutation.mutate(eventId)}
                />
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
    
    {/* 1. Tombol ini SEKARANG HANYA untuk membuka modal */}
    <Button 
      onClick={() => setIsHomepageUploadOpen(true)} 
      className="bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-black"
    >
      <Upload className="w-4 h-4 mr-2" />
      Upload Foto
    </Button>
  </div>

  {/* 2. Modal Upload, hanya muncul jika isHomepageUploadOpen adalah true */}
  {isHomepageUploadOpen && (
    <Card className="mb-6 border-wedding-gold/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {/* Anda mungkin perlu mengimpor 'Crown' dari lucide-react jika belum */}
          <Upload className="w-5 h-5 text-wedding-gold" />
          Upload Foto Homepage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="homepage-photo-input">Pilih Foto</Label>
          <Input
            id="homepage-photo-input"
            type="file"
            multiple // Tambahkan 'multiple' jika ingin bisa memilih banyak file
            accept="image/*"
            onChange={handleHomepagePhotoUpload} // Handler upload ada di sini
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Ukuran maksimal 10MB.
          </p>
        </div>
        <div className="flex space-x-2">
          {/* 3. Tombol Batal SEKARANG berfungsi dengan benar */}
          <Button
            onClick={() => setIsHomepageUploadOpen(false)}
            variant="outline"
          >
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
  
  {/* Indikator Loading */}
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
                      <div className="photo-grid">
                        {homepagePhotos.map((photo: Photo, index: number) => (
                          <div key={photo.id} className="relative group cursor-pointer"
                          onClick={() => {
                            setSelectedPhotoIndex(index);
                            setIsLightboxOpen(true);
                          }}>
                            <img
                              src={photo.url}
                              alt={photo.original_name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="mobile-delete-btn opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <h3 className="text-lg font-semibold">Foto Galeri Event</h3>
                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
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
                        {selectedEventForPhotos && (
                          <Button
                            onClick={() => setIsOfficialUploadOpen(true)}
                            className="bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-black"
                          >
                            <Crown className="text-black w-4 h-4 mr-2" />
                            Upload Foto Official
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Official Photo Upload Modal */}
                    {isOfficialUploadOpen && selectedEventForPhotos && (
                      <Card className="mb-6 border-wedding-gold/20">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Crown className="w-5 h-5 text-wedding-gold" />
                            Upload Foto Official
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="officialPhoto">Pilih Foto</Label>
                            <Input
                              id="officialPhoto"
                              type="file"
                              accept="image/*"
                              onChange={handleOfficialPhotoUpload}
                              className="mt-1"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Ukuran maksimal 10MB. Format: JPG, PNG, GIF
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setIsOfficialUploadOpen(false);
                                setOfficialPhotoDescription("");
                              }}
                              variant="outline"
                            >
                              Batal
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {uploadOfficialPhotoMutation.isPending && (
                      <div className="flex items-center justify-center py-4">
                        <LoadingSpinner />
                        <span className="ml-2 text-sm text-gray-600">Mengupload foto official...</span>
                      </div>
                    )}

                    {selectedEventForPhotos ? (
                      eventPhotosLoading ? (
                        <div className="text-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : eventPhotos.length > 0 ? (
                        <div>
                          {/* Group photos by album */}
                          {["Official", "Tamu", "Bridesmaid"].map(albumName => { 
                            const albumPhotos = eventPhotos.filter((photo: Photo) => photo.album_name === albumName);
                            if (albumPhotos.length === 0) return null;
                            
                            return (
                              <div key={albumName} className="mb-8">
                                <h4 className="text-md font-semibold mb-4 text-wedding-gold flex items-center gap-2">
                                  {albumName === "Official" && <Crown className="w-4 h-4" />}
                                  Album {albumName} ({albumPhotos.length} foto)
                                </h4>
                                <div className="photo-grid">
                                    {albumPhotos.map((photo: Photo, index: number) => (
                                    <div key={photo.id} className="relative group cursor-pointer"
                                    onClick={() => {
                                      setSelectedPhotoIndex(index);
                                      setIsLightboxOpen(true);
                                    }}>
                                      <img
                                        src={photo.url}
                                        alt={photo.original_name}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                         
                                        </div>
                                        <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                                          {photo.uploader_name || 'Anonim'}
                                        </div>
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
        {isLightboxOpen && selectedPhotoIndex !== null && (
          <PhotoLightbox
          photos={selectedPhotoTab === "homepage" ? homepagePhotos : eventPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setIsLightboxOpen(false)}
          onDelete={(photoId) => {
            if (confirm('Yakin ingin menghapus foto ini secara permanen?')) {
              deletePhotoMutation.mutate(photoId, {
                onSuccess: () => {
                  // Tutup lightbox setelah berhasil menghapus
                  setIsLightboxOpen(false); 
                },
              });
            }
          }}
          onLike={(photoId) => {
            // Like functionality not implemented in admin panel
            console.log('Like photo:', photoId);
          }}
          onUnlike={(photoId) => {
            // Unlike functionality not implemented in admin panel
            console.log('Unlike photo:', photoId);
          }}
        />
        )}
      </div>
    </div>
  );
} 