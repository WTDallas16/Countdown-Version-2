import { useEffect } from 'react';
import type { CountdownSettings } from './types';
import { useCountdownManager } from './hooks/useCountdownManager';
import { getStateFromURL, updateURLWithState } from './utils/urlCompression';
import { Countdown } from './components/Countdown';
import { BackgroundManager } from './components/BackgroundManager';
import { SettingsPanel } from './components/SettingsPanel';

// Default settings
const DEFAULT_SETTINGS: CountdownSettings = {
  targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  photos: [],
  photoMode: 'slideshow',
  slideshowInterval: 5,
  currentPhotoIndex: 0,
  textStyle: {
    content: 'Countdown to Adventure',
    fontFamily: 'Inter',
    fontSize: 48,
    color: '#ffffff',
    position: 'center',
    textShadow: true,
    shadowColor: '#000000',
    shadowBlur: 10,
    backgroundOverlay: true,
    overlayColor: '#000000',
    overlayOpacity: 0.5,
  },
};

function App() {
  const {
    countdowns,
    activeCountdown,
    createCountdown,
    deleteCountdown,
    renameCountdown,
    switchCountdown,
    updateActiveCountdown,
    duplicateCountdown,
  } = useCountdownManager(DEFAULT_SETTINGS);

  // Check for shared URL on mount
  useEffect(() => {
    const urlState = getStateFromURL();
    if (urlState && activeCountdown) {
      // Load shared countdown and create a new one with it
      const sharedName = `Shared - ${new Date().toLocaleDateString()}`;
      createCountdown(sharedName);
      // Update the newly created countdown with the shared settings
      setTimeout(() => {
        updateActiveCountdown(urlState);
      }, 100);
      // Clear URL hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []); // Only run once on mount

  const settings = activeCountdown?.settings || DEFAULT_SETTINGS;

  // Load Google Fonts dynamically
  useEffect(() => {
    const fontFamily = settings.textStyle.fontFamily;
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      / /g,
      '+'
    )}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [settings.textStyle.fontFamily]);

  const handleShare = () => {
    try {
      updateURLWithState(settings);
      return window.location.href;
    } catch (error) {
      console.error('Failed to create shareable URL:', error);
      return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <BackgroundManager
        photos={settings.photos}
        mode={settings.photoMode}
        interval={settings.slideshowInterval}
        currentIndex={settings.currentPhotoIndex}
      />

      {/* Countdown Display */}
      <Countdown
        targetDate={new Date(settings.targetDate)}
        textStyle={settings.textStyle}
      />

      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        onSettingsChange={updateActiveCountdown}
        onShare={handleShare}
        countdowns={countdowns}
        activeCountdownId={activeCountdown?.id || null}
        onCreateCountdown={createCountdown}
        onDeleteCountdown={deleteCountdown}
        onRenameCountdown={renameCountdown}
        onSwitchCountdown={switchCountdown}
        onDuplicateCountdown={duplicateCountdown}
      />
    </div>
  );
}

export default App;
