import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Camera, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Download,
  Trash2,
  Eye,
  Settings,
  Database,
  Activity
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Event, Photo, Message } from "@shared/schema";

interface AdminStats {
  totalEvents: number;
  totalPhotos: number;
  totalMessages: number;
  activeEvents: number;
  storageUsed: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEventForUpload, setSelectedEventForUpload] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication
  const handleLogin = () => {
    if (username === "admin" && password === "klp123") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin",
        description: "Successfully logged into admin dashboard.",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch admin stats
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/stats");
      return response.json() as Promise<AdminStats>;
    },
    enabled: isAuthenticated,
  });

  // Fetch all events for admin
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/admin/events'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/events");
      return response.json() as Promise<Event[]>;
    },
    enabled: isAuthenticated,
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
        title: "Event Deleted",
        description: "Event and all associated data have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Could not delete the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Official photo upload function
  const handleOfficialPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!selectedEventForUpload) {
      toast({
        title: "Select Event",
        description: "Please select an event first.",
        variant: "destructive",
      });
      return;
    }

    let completed = 0;
    const totalFiles = files.length;

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('uploaderName', 'Admin');
        formData.append('albumName', 'Official');

        const response = await fetch(`/api/events/${selectedEventForUpload}/photos`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          completed++;
          setUploadProgress((completed / totalFiles) * 100);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (completed > 0) {
      toast({
        title: "Upload Complete",
        description: `${completed} official photos uploaded successfully.`,
      });
      loadRecentPhotos();
    }

    setTimeout(() => setUploadProgress(0), 2000);
  };

  // Load recent photos
  const loadRecentPhotos = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/recent-photos");
      const photos = await response.json();
      setRecentPhotos(photos);
    } catch (error) {
      console.error('Error loading recent photos:', error);
    }
  };

  // Delete photo function
  const deletePhoto = async (photoId: string) => {
    try {
      await apiRequest("DELETE", `/api/admin/photos/${photoId}`);
      toast({
        title: "Photo Deleted",
        description: "Photo has been removed successfully.",
      });
      loadRecentPhotos();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the photo.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-wedding-ivory flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-rose-gold mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-rose-gold text-white hover:bg-deep-rose"
            >
              Login to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-ivory">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-rose-gold/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-rose-gold" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-rose-gold">
                    {statsLoading ? <LoadingSpinner size="sm" /> : adminStats?.totalEvents || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-rose-gold/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Photos</p>
                  <p className="text-3xl font-bold text-rose-gold">
                    {statsLoading ? <LoadingSpinner size="sm" /> : adminStats?.totalPhotos || 0}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-rose-gold/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-3xl font-bold text-rose-gold">
                    {statsLoading ? <LoadingSpinner size="sm" /> : adminStats?.totalMessages || 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-rose-gold/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Storage Used</p>
                  <p className="text-3xl font-bold text-rose-gold">
                    {statsLoading ? <LoadingSpinner size="sm" /> : adminStats?.storageUsed || "0 GB"}
                  </p>
                </div>
                <Database className="h-8 w-8 text-rose-gold/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} • {event.id}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant={event.isPremium ? "default" : "outline"}>
                              {event.isPremium ? "Premium" : "Free"}
                            </Badge>
                            <Badge variant="outline">
                              Active
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/event/${event.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteEventMutation.mutate(event.id)}
                            disabled={deleteEventMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No events found. Events created by users will appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Photo Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Cleanup Storage
                </Button>
                <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                  <Download className="h-4 w-4 mr-2" />
                  Backup Photos
                </Button>
              </div>
            </div>

            {/* Event Selection for Official Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Official Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Event</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => setSelectedEventForUpload(e.target.value)}
                    value={selectedEventForUpload}
                  >
                    <option value="">Choose an event for official photos</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} - {new Date(event.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEventForUpload && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-gold border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-3 text-rose-gold" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Upload Official Photos</span>
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, atau GIF (maks. 10MB per file)</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleOfficialPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-rose-gold h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {recentPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.url}
                            alt={photo.originalName}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deletePhoto(photo.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{photo.albumName}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No recent photo uploads.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Message Moderation</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Flagged
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Message moderation interface - shows recent messages and moderation tools.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Usage analytics chart - events created over time, photo uploads, user engagement.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Event Duration</span>
                      <span className="font-semibold">4.2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Photos per Event</span>
                      <span className="font-semibold">47 avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guest Participation</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gallery Management</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <Camera className="h-4 w-4 mr-2" />
                Add to Gallery
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Gallery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-gold border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-3 text-rose-gold" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Upload Portfolio Photos</span>
                        </p>
                        <p className="text-xs text-gray-500">High quality wedding photos for gallery</p>
                      </div>
                      <input type="file" multiple accept="image/*" className="hidden" />
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Category</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="weddings">Weddings</option>
                      <option value="engagement">Engagement</option>
                      <option value="prewedding">Pre-wedding</option>
                      <option value="family">Family</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gallery Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Wedding Portfolio</span>
                      <Badge>45 Photos</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Engagement Sessions</span>
                      <Badge>23 Photos</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Pre-wedding</span>
                      <Badge>38 Photos</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Family Portraits</span>
                      <Badge>12 Photos</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pricing Management</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <Settings className="h-4 w-4 mr-2" />
                Update Pricing
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Packages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Basic Package</h4>
                      <Badge variant="outline">Popular</Badge>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Price (Rp)" defaultValue="5000000" />
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Package description..."
                        defaultValue="4 jam liputan, 100 foto edit, USB flashdisk, online gallery"
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Premium Package</h4>
                      <Badge className="bg-rose-gold text-white">Recommended</Badge>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Price (Rp)" defaultValue="8000000" />
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Package description..."
                        defaultValue="8 jam liputan, 200 foto edit, album cetak, USB flashdisk, online gallery, video highlight"
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Platinum Package</h4>
                      <Badge variant="secondary">Luxury</Badge>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Price (Rp)" defaultValue="12000000" />
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Package description..."
                        defaultValue="Full day coverage, unlimited foto edit, premium album, USB + online gallery, cinematic video, same day edit"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Pre-wedding Session</span>
                      <Input className="w-32" placeholder="Price" defaultValue="2500000" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Engagement Session</span>
                      <Input className="w-32" placeholder="Price" defaultValue="1500000" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Extra Hour Coverage</span>
                      <Input className="w-32" placeholder="Price" defaultValue="500000" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Album Upgrade</span>
                      <Input className="w-32" placeholder="Price" defaultValue="800000" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Video Highlight</span>
                      <Input className="w-32" placeholder="Price" defaultValue="1200000" />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-rose-gold/10 rounded-lg">
                    <h5 className="font-semibold text-rose-gold mb-2">Pricing Notes</h5>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows={4}
                      placeholder="Additional notes about pricing..."
                      defaultValue="- Harga belum termasuk transport luar kota&#10;- DP 30% untuk booking&#10;- Pelunasan H-7 sebelum acara&#10;- Reschedule maksimal 2x"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">System Settings</h2>
              <Button className="bg-rose-gold text-white hover:bg-deep-rose">
                <Settings className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Files per Event</label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Allowed File Types</label>
                    <Input defaultValue="jpg, jpeg, png, gif" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Run Database Cleanup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Check System Health
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export System Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}