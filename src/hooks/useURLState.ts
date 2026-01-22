import { useEffect, useState, useRef } from 'react';
import type { CountdownSettings } from '../types';
import { getStateFromURL, updateURLWithState } from '../utils/urlCompression';

const LOCALSTORAGE_KEY = 'countdown-settings';

function saveToLocalStorage(settings: CountdownSettings) {
  try {
    const json = JSON.stringify(settings);
    localStorage.setItem(LOCALSTORAGE_KEY, json);
    console.log('✅ Saved to localStorage:', {
      photosCount: settings.photos.length,
      size: Math.round(json.length / 1024) + 'KB',
    });
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
  }
}

function loadFromLocalStorage(): CountdownSettings | null {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('✅ Loaded from localStorage:', {
        photosCount: parsed.photos?.length,
        size: Math.round(saved.length / 1024) + 'KB',
      });
      return parsed;
    }
    console.log('ℹ️ No saved data in localStorage');
    return null;
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error);
    return null;
  }
}

export function useURLState(initialState: CountdownSettings) {
  const [settings, setSettings] = useState<CountdownSettings>(() => {
    console.log('🚀 Initializing useURLState...');
    // Priority: 1) URL state (for shared links), 2) localStorage, 3) defaults
    const urlState = getStateFromURL();
    if (urlState) {
      console.log('📥 Found URL state, loading and saving to localStorage');
      // If loaded from URL, save it to localStorage for future sessions
      saveToLocalStorage(urlState);
      // Clear the hash so it doesn't interfere with future refreshes
      console.log('🧹 Clearing URL hash to prevent interference');
      window.history.replaceState(null, '', window.location.pathname);
      return urlState;
    }

    const localState = loadFromLocalStorage();
    if (localState) {
      console.log('📂 Using localStorage state');
      return localState;
    }

    console.log('🆕 Using default state');
    return initialState;
  });

  const [hasLoadedFromURL, setHasLoadedFromURL] = useState(false);
  const isInitialMount = useRef(true);

  // Load state from URL on mount (for shared links) - only runs once
  useEffect(() => {
    const urlState = getStateFromURL();
    if (urlState && !hasLoadedFromURL) {
      console.log('📥 Loading URL state in useEffect');
      setSettings(urlState);
      saveToLocalStorage(urlState);
      setHasLoadedFromURL(true);
      // Clear the hash after loading
      console.log('🧹 Clearing URL hash after loading');
      window.history.replaceState(null, '', window.location.pathname);
    }
    isInitialMount.current = false;
  }, [hasLoadedFromURL]);

  // Auto-save to localStorage whenever settings change (after initial load)
  useEffect(() => {
    console.log('Settings changed, isInitialMount:', isInitialMount.current);
    if (!isInitialMount.current) {
      console.log('⏱️ Scheduling save to localStorage in 500ms...');
      const timeoutId = setTimeout(() => {
        console.log('💾 Auto-saving to localStorage now');
        saveToLocalStorage(settings);
      }, 500);

      return () => {
        console.log('🚫 Cancelled pending save');
        clearTimeout(timeoutId);
      };
    }
  }, [settings]);

  // Update URL when settings change (but not on initial load)
  const updateSettings = (
    newSettingsOrUpdater: CountdownSettings | ((prev: CountdownSettings) => CountdownSettings)
  ) => {
    setSettings(newSettingsOrUpdater);
  };

  const shareURL = () => {
    try {
      updateURLWithState(settings);
      return window.location.href;
    } catch (error) {
      console.error('Failed to create shareable URL:', error);
      return null;
    }
  };

  const resetSettings = () => {
    setSettings(initialState);
    window.location.hash = '';
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

  return {
    settings,
    updateSettings,
    shareURL,
    resetSettings,
  };
}
