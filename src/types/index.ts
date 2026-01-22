export type PhotoMode = 'slideshow' | 'random' | 'manual';

export type TextPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Photo {
  id: string;
  data: string; // base64 encoded image
  thumbnail?: string;
}

export interface TextStyle {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  position: TextPosition;
  textShadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  backgroundOverlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
}

export interface CountdownSettings {
  targetDate: string; // ISO 8601 date string
  photos: Photo[];
  photoMode: PhotoMode;
  slideshowInterval: number; // in seconds
  currentPhotoIndex: number;
  textStyle: TextStyle;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
