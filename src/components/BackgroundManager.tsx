import { usePhotos } from '../hooks/usePhotos';
import type { Photo, PhotoMode } from '../types';

interface BackgroundManagerProps {
  photos: Photo[];
  mode: PhotoMode;
  interval: number;
  currentIndex: number;
}

export function BackgroundManager({
  photos,
  mode,
  interval,
  currentIndex,
}: BackgroundManagerProps) {
  const { currentPhoto } = usePhotos({
    photos,
    mode,
    interval,
    currentIndex,
  });

  if (!currentPhoto && photos.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
    );
  }

  if (!currentPhoto) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
    );
  }

  return (
    <div className="fixed inset-0 bg-black" style={{ zIndex: 0 }}>
      <img
        key={currentPhoto.id}
        src={currentPhoto.data}
        alt="Background"
        className="w-full h-full"
        style={{
          transition: 'opacity 0.5s ease-in-out',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
