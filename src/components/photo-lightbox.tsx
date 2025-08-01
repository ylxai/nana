// file: src/components/photo-lightbox.tsx

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Download, Trash } from "lucide-react";
import type { Photo } from "@/lib/database";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onDelete: (photoId: string) => void;
  onLike: (photoId: string) => void;
  onUnlike: (photoId: string) => void;
}

export default function PhotoLightbox({ photos, currentIndex, onClose, onDelete, onLike }: PhotoLightboxProps) {
  const [localIndex, setLocalIndex] = useState(currentIndex);
  
  const currentPhoto = photos[localIndex];

  const goToPrevious = () => {
    const isFirstSlide = localIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : localIndex - 1;
    setLocalIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = localIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : localIndex + 1;
    setLocalIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [localIndex]);

  if (!currentPhoto) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black border-none flex items-center justify-center">
      <VisuallyHidden asChild>
          <DialogTitle>Image Viewer</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Viewing image: {currentPhoto.original_name}. Use arrow keys to navigate.
          </DialogDescription>
        </VisuallyHidden>
        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
           <img 
              key={currentPhoto.id}
              src={currentPhoto.url} 
              alt={currentPhoto.original_name} 
              className="max-w-full max-h-[80vh] object-contain animate-fade-in"
            />
        </div>

        {/* Prev Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 hover:text-white"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 hover:text-white"
          onClick={goToNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Top Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
            <a href={currentPhoto.url} download target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 hover:text-white">
                  <Download className="h-6 w-6" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 hover:text-white" onClick={() => onDelete(currentPhoto.id)}>
              <Trash className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 hover:text-white" onClick={onClose}>
                <X className="h-6 w-6" /> 
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}