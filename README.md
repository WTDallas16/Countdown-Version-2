# Countdown Website

A beautiful, customizable countdown timer with photo backgrounds and shareable URLs. Built with React, TypeScript, and Vite.

## Features

- **Real-time Countdown**: Live countdown to any date/time with days, hours, minutes, and seconds
- **Photo Backgrounds**: Upload multiple photos with three display modes:
  - **Slideshow**: Auto-cycle through photos (3s, 5s, 10s, or 30s intervals)
  - **Random**: Random photo selection on page load
  - **Manual**: Select specific photos from a thumbnail grid
- **Text Customization**:
  - 10 Google Fonts to choose from
  - Adjustable font size (12px - 200px)
  - Color picker for text color
  - 7 position presets (corners, center, edges)
  - Text shadow with customizable blur and color
  - Background overlay for better readability
  - Custom text content
- **URL-Based Sharing**:
  - All settings and photos encoded in URL
  - Copy and share links with complete configurations
  - LZString compression for efficient URL size
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Set Target Date**: Click the settings gear icon (⚙️) and go to the "Date & Time" tab to set your countdown target.

2. **Add Photos**:
   - Go to the "Photos" tab
   - Drag and drop images or click to upload
   - Choose between Slideshow, Random, or Manual mode
   - Click thumbnails to select photos in Manual mode
   - Click the × button on thumbnails to delete photos

3. **Customize Text**:
   - Go to the "Text Style" tab
   - Edit the countdown text content
   - Choose font, size, and color
   - Select position on screen
   - Enable text shadow and background overlay for better visibility

4. **Share Your Countdown**:
   - Go to the "Share" tab
   - Click "Copy Shareable Link" to generate a URL with all your settings
   - Share the URL - anyone who opens it will see your exact configuration
   - The URL includes all photos and settings (compressed using LZString)

5. **Reset Settings**:
   - Go to the "Share" tab
   - Click "Reset All Settings" to start fresh

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **LZString**: URL compression for sharing
- **react-colorful**: Color picker component
- **date-fns**: Date formatting and manipulation

## Project Structure

```
countdown-website/
├── src/
│   ├── components/
│   │   ├── Countdown.tsx         # Main countdown display
│   │   ├── BackgroundManager.tsx # Photo slideshow/random/manual
│   │   ├── TextCustomizer.tsx    # Text styling controls
│   │   ├── DateInput.tsx         # Date/time picker
│   │   ├── PhotoUploader.tsx     # Image upload interface
│   │   ├── SettingsPanel.tsx     # Collapsible settings sidebar
│   │   └── ShareButton.tsx       # Generate/copy shareable URL
│   ├── hooks/
│   │   ├── useCountdown.ts       # Countdown logic
│   │   ├── usePhotos.ts          # Photo management & modes
│   │   └── useURLState.ts        # URL encode/decode state
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── countdown.ts          # Time calculation utilities
│   │   └── urlCompression.ts     # LZString helpers
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Tips

- **Image Size**: For best performance, use compressed images. URLs over 50KB will show a warning.
- **Browser Limits**: Most browsers support URLs up to ~2MB, but keeping them under 50KB is recommended.
- **Font Loading**: Google Fonts load dynamically when selected, so there may be a brief delay when changing fonts.
- **Slideshow Timing**: Slideshow intervals can be set to 3, 5, 10, or 30 seconds.
- **Mobile Usage**: Settings panel slides in from the right and includes an overlay for easy dismissal.

## Keyboard Shortcuts

- **ESC**: Close settings panel (when open)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Deployment

This app can be deployed to any static hosting service:

### Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Vercel
```bash
npm run build
# Use Vercel CLI or connect GitHub repo
```

### GitHub Pages
```bash
npm run build
# Deploy the 'dist' folder to gh-pages branch
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
