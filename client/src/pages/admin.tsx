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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Photo management interface - shows recent uploads, storage usage, and moderation tools.
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