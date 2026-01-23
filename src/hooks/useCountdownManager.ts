import { useState, useEffect, useCallback, useRef } from 'react';
import type { CountdownSettings } from '../types';
import type { SavedCountdown, CountdownCollection } from '../types/countdown-manager';

const STORAGE_KEY = 'countdown-collection';

// Approximate localStorage limit (varies by browser, typically 5-10MB)
const APPROXIMATE_STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

function generateId(): string {
  return `countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getStorageInfo() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        usedBytes: 0,
        usedKB: 0,
        usedMB: 0,
        percentUsed: 0,
        limitMB: Math.round(APPROXIMATE_STORAGE_LIMIT / 1024 / 1024),
      };
    }

    const usedBytes = new Blob([saved]).size;
    const usedKB = Math.round(usedBytes / 1024);
    const usedMB = (usedBytes / 1024 / 1024).toFixed(2);
    const percentUsed = Math.round((usedBytes / APPROXIMATE_STORAGE_LIMIT) * 100);

    return {
      usedBytes,
      usedKB,
      usedMB: parseFloat(usedMB),
      percentUsed,
      limitMB: Math.round(APPROXIMATE_STORAGE_LIMIT / 1024 / 1024),
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return {
      usedBytes: 0,
      usedKB: 0,
      usedMB: 0,
      percentUsed: 0,
      limitMB: 5,
    };
  }
}

function loadCollection(): CountdownCollection {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('📂 Loading from localStorage:', saved ? 'Data found' : 'No data');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('✅ Loaded countdowns:', parsed.countdowns.length, 'countdowns');
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load countdown collection:', error);
  }

  console.log('📝 No saved data, returning empty collection');
  return {
    countdowns: [],
    activeCountdownId: null,
  };
}

function saveCollection(collection: CountdownCollection): void {
  try {
    const jsonString = JSON.stringify(collection);
    const sizeKB = Math.round(new Blob([jsonString]).size / 1024);

    console.log('💾 Attempting to save:', collection.countdowns.length, 'countdowns,', sizeKB, 'KB');

    localStorage.setItem(STORAGE_KEY, jsonString);
    console.log('✓ Successfully saved to localStorage');

    // Verify the save worked
    const verification = localStorage.getItem(STORAGE_KEY);
    if (verification === jsonString) {
      console.log('✓ Save verified successfully');
    } else {
      console.error('⚠️ Save verification failed!');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('❌ STORAGE FULL! Cannot save countdowns.');
      console.error('💡 Solution: Delete old countdowns or remove photos to free up space.');

      // Show user-friendly alert
      alert(
        '⚠️ Storage Full!\n\n' +
        'Your browser\'s storage is full. To save new countdowns:\n\n' +
        '1. Delete old countdowns you no longer need\n' +
        '2. Remove some photos from existing countdowns\n' +
        '3. Clear your browser data\n\n' +
        'Your current changes could not be saved.'
      );
    } else {
      console.error('❌ Failed to save countdown collection:', error);
    }
  }
}

export function useCountdownManager(defaultSettings: CountdownSettings) {
  const [collection, setCollection] = useState<CountdownCollection>(() => {
    console.log('🚀 Initializing countdown manager...');
    const loaded = loadCollection();

    // If no countdowns exist, create a default one
    if (loaded.countdowns.length === 0) {
      console.log('🆕 Creating default countdown');
      const defaultCountdown: SavedCountdown = {
        id: generateId(),
        name: 'My Countdown',
        settings: defaultSettings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newCollection = {
        countdowns: [defaultCountdown],
        activeCountdownId: defaultCountdown.id,
      };

      saveCollection(newCollection);
      return newCollection;
    }

    console.log('✓ Using loaded collection with', loaded.countdowns.length, 'countdowns');
    return loaded;
  });

  // Track if this is the first render
  const isFirstRender = useRef(true);

  // Auto-save collection whenever it changes (skip first render since it's already saved)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('⏭️ Skipping auto-save on first render');
      return;
    }
    console.log('🔄 Auto-saving collection...');
    saveCollection(collection);
  }, [collection]);

  const activeCountdown = collection.countdowns.find(
    (c) => c.id === collection.activeCountdownId
  );

  const createCountdown = useCallback((name: string) => {
    const newCountdown: SavedCountdown = {
      id: generateId(),
      name,
      settings: defaultSettings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCollection((prev) => ({
      countdowns: [...prev.countdowns, newCountdown],
      activeCountdownId: newCountdown.id,
    }));

    return newCountdown.id;
  }, [defaultSettings]);

  const deleteCountdown = useCallback((id: string) => {
    setCollection((prev) => {
      const filtered = prev.countdowns.filter((c) => c.id !== id);

      // If we deleted the active countdown, switch to the first one
      let newActiveId = prev.activeCountdownId;
      if (prev.activeCountdownId === id) {
        newActiveId = filtered.length > 0 ? filtered[0].id : null;
      }

      return {
        countdowns: filtered,
        activeCountdownId: newActiveId,
      };
    });
  }, []);

  const renameCountdown = useCallback((id: string, newName: string) => {
    setCollection((prev) => ({
      ...prev,
      countdowns: prev.countdowns.map((c) =>
        c.id === id
          ? { ...c, name: newName, updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  }, []);

  const switchCountdown = useCallback((id: string) => {
    setCollection((prev) => ({
      ...prev,
      activeCountdownId: id,
    }));
  }, []);

  const updateActiveCountdown = useCallback((settings: CountdownSettings) => {
    setCollection((prev) => ({
      ...prev,
      countdowns: prev.countdowns.map((c) =>
        c.id === prev.activeCountdownId
          ? { ...c, settings, updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  }, []);

  const duplicateCountdown = useCallback((id: string) => {
    const original = collection.countdowns.find((c) => c.id === id);
    if (!original) return;

    const duplicate: SavedCountdown = {
      id: generateId(),
      name: `${original.name} (Copy)`,
      settings: { ...original.settings },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCollection((prev) => ({
      countdowns: [...prev.countdowns, duplicate],
      activeCountdownId: duplicate.id,
    }));
  }, [collection.countdowns]);

  const getStorageUsage = useCallback(() => {
    return getStorageInfo();
  }, []);

  return {
    countdowns: collection.countdowns,
    activeCountdown,
    createCountdown,
    deleteCountdown,
    renameCountdown,
    switchCountdown,
    updateActiveCountdown,
    duplicateCountdown,
    getStorageUsage,
  };
}
