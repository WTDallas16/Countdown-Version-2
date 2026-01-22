import { useState, useEffect, useCallback } from 'react';
import type { CountdownSettings } from '../types';
import type { SavedCountdown, CountdownCollection } from '../types/countdown-manager';

const STORAGE_KEY = 'countdown-collection';

function generateId(): string {
  return `countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadCollection(): CountdownCollection {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load countdown collection:', error);
  }

  return {
    countdowns: [],
    activeCountdownId: null,
  };
}

function saveCollection(collection: CountdownCollection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Failed to save countdown collection:', error);
  }
}

export function useCountdownManager(defaultSettings: CountdownSettings) {
  const [collection, setCollection] = useState<CountdownCollection>(() => {
    const loaded = loadCollection();

    // If no countdowns exist, create a default one
    if (loaded.countdowns.length === 0) {
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

    return loaded;
  });

  // Auto-save collection whenever it changes
  useEffect(() => {
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

  return {
    countdowns: collection.countdowns,
    activeCountdown,
    createCountdown,
    deleteCountdown,
    renameCountdown,
    switchCountdown,
    updateActiveCountdown,
    duplicateCountdown,
  };
}
