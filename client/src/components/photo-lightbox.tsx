import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Heart, 
  X,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@shared/schema";

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  eventId: string;
}

export default function PhotoLightbox({ photos, currentIndex, onClose, eventId }: PhotoLightboxProps) {
  const [index, setIndex] = useState(currentIndex);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentPhoto = photos[index];

  // Slideshow effect
  useEffect(() => {
    if (isSlideshow && photos.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % photos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSlideshow, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsSlideshow(!isSlideshow);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isSlideshow]);

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % photos.length);
    resetView();
  };

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetView();
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  // Like photo mutation
  const likePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const newLikes = (currentPhoto.likes || 0) + 1;
      const response = await apiRequest("PATCH", `/api/photos/${photoId}/likes`, { likes: newLikes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events', eventId, 'photos'] });
      toast({
        title: "Foto Disukai!",
        description: "Terima kasih atas apresiasinya.",
      });
    },
  });

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentPhoto) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-black/95">
        <div className="relative w-full h-full flex flex-col">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {index + 1} dari {photos.length}
              </span>
              <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentPhoto.albumName}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSlideshow(!isSlideshow)}
                className="text-white hover:bg-white/20"
              >
                {isSlideshow ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.min(z + 0.5, 3))}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRotation(r => r + 90)}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-16">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.originalName}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white">
                  <p className="font-medium">{currentPhoto.originalName}</p>
                  <p className="text-sm text-gray-300">
                    Diunggah oleh: {currentPhoto.uploaderName || "Anonim"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(currentPhoto.uploadedAt!).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likePhotoMutation.mutate(currentPhoto.id)}
                    disabled={likePhotoMutation.isPending}
                    className="text-white hover:bg-white/20 flex items-center space-x-1"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{currentPhoto.likes || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadPhoto(currentPhoto)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Photo Thumbnails */}
              {photos.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        setIndex(i);
                        resetView();
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        i === index ? 'border-rose-gold' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.originalName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}