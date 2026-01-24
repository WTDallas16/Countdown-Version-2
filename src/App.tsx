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
    getStorageUsage,
  } = useCountdownManager(DEFAULT_SETTINGS);

  // Check for shared URL on mount
  useEffect(() => {
    console.log('🔗 Checking for shared URL...');
    const urlState = getStateFromURL();

    if (!urlState) {
      console.log('📭 No shared URL state found');
      return;
    }

    // Check if this is a hash we created ourselves (for sharing)
    const currentHash = window.location.hash;
    const selfGeneratedHash = sessionStorage.getItem('self-generated-hash');

    if (selfGeneratedHash === currentHash) {
      console.log('🔄 This is a self-generated share link, not loading as new countdown');
      return;
    }

    console.log('📬 Shared URL detected from external source! Loading settings...');

    // Load shared countdown and create a new one with it
    const sharedName = `Shared - ${new Date().toLocaleDateString()}`;
    const newId = createCountdown(sharedName);

    console.log('✓ Created new countdown:', sharedName, 'with ID:', newId);

    // Update the newly created countdown with the shared settings
    setTimeout(() => {
      console.log('🔄 Updating countdown with shared settings...');
      updateActiveCountdown(urlState);
      console.log('✓ Shared settings applied!');

      // Clear the hash and sessionStorage after successfully loading
      window.history.replaceState(null, '', window.location.pathname);
      sessionStorage.removeItem('self-generated-hash');
      console.log('🧹 Cleared URL hash after loading shared countdown');
    }, 150);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Mark this hash as self-generated so we don't load it as a new countdown on refresh
      const currentHash = window.location.hash;
      sessionStorage.setItem('self-generated-hash', currentHash);
      console.log('🔖 Marked hash as self-generated:', currentHash.substring(0, 50) + '...');

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
        getStorageUsage={getStorageUsage}
      />
    </div>
  );
}

export default App;
