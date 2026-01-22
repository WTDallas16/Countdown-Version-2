import { useRef, useState } from 'react';
import type { Photo } from '../types';

interface PhotoUploaderProps {
  photos: Photo[];
  onPhotosAdd: (photos: Photo[]) => void;
  onPhotoDelete: (id: string) => void;
  onPhotoSelect: (index: number) => void;
  currentIndex: number;
}

export function PhotoUploader({
  photos,
  onPhotosAdd,
  onPhotoDelete,
  onPhotoSelect,
  currentIndex,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        // Read original file
        const originalBase64 = await fileToBase64(file);

        // Compress main image to max 1920x1080 with 85% quality for good balance
        const compressedBase64 = await compressImage(originalBase64, 1920, 1080, 0.85);

        // Create thumbnail
        const thumbnail = await createThumbnail(compressedBase64);

        const originalSize = Math.round(originalBase64.length / 1024);
        const compressedSize = Math.round(compressedBase64.length / 1024);

        console.log(`📸 Image ${i + 1}: ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize/originalSize) * 100)}% reduction)`);

        newPhotos.push({
          id: `${Date.now()}-${i}`,
          data: compressedBase64,
          thumbnail,
        });
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }

    if (newPhotos.length > 0) {
      onPhotosAdd(newPhotos);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (base64: string, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64);
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = base64;
    });
  };

  const createThumbnail = (base64: string): Promise<string> => {
    return compressImage(base64, 100, 100, 0.7);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <div className="text-gray-600">
          <p className="font-medium">Drop images here or click to upload</p>
          <p className="text-sm mt-1">Supports JPG, PNG, GIF</p>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-300'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => onPhotoSelect(index)}
            >
              <img
                src={photo.thumbnail || photo.data}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onPhotoDelete(photo.id);
                }}
              >
                ×
              </button>
              {index === currentIndex && (
                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Active
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
