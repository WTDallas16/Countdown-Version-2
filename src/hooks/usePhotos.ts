import { useState, useEffect, useCallback, useRef } from 'react';
import type { Photo, PhotoMode } from '../types';

interface UsePhotosProps {
  photos: Photo[];
  mode: PhotoMode;
  interval: number; // in seconds
  currentIndex: number;
}

export function usePhotos({
  photos,
  mode,
  interval,
  currentIndex,
}: UsePhotosProps) {
  const [displayIndex, setDisplayIndex] = useState(0);

  // Generate random index
  const getRandomIndex = useCallback(() => {
    if (photos.length === 0) return 0;
    return Math.floor(Math.random() * photos.length);
  }, [photos.length]);

  // Ensure displayIndex is valid when photos change
  useEffect(() => {
    if (photos.length > 0 && displayIndex >= photos.length) {
      setDisplayIndex(0);
    }
  }, [photos.length, displayIndex]);

  // Handle mode changes
  const prevModeRef = useRef(mode);
  useEffect(() => {
    const prevMode = prevModeRef.current;

    if (prevMode !== mode && photos.length > 0) {
      if (mode === 'random') {
        setDisplayIndex(getRandomIndex());
      } else if (mode === 'slideshow') {
        // Keep current index or reset to 0
        setDisplayIndex(prev => Math.min(prev, photos.length - 1));
      } else if (mode === 'manual') {
        setDisplayIndex(Math.min(currentIndex, photos.length - 1));
      }
    }

    prevModeRef.current = mode;
  }, [mode, photos.length, currentIndex, getRandomIndex]);

  // Handle slideshow mode - cycle through photos
  useEffect(() => {
    if (mode !== 'slideshow' || photos.length === 0) return;

    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % photos.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [mode, interval, photos.length]);

  // Handle manual mode - sync with currentIndex changes
  useEffect(() => {
    if (mode === 'manual' && photos.length > 0) {
      setDisplayIndex(Math.min(currentIndex, photos.length - 1));
    }
  }, [mode, currentIndex, photos.length]);

  // Get current photo
  const currentPhoto = photos[displayIndex] || null;

  return {
    currentPhoto,
    displayIndex,
  };
}
