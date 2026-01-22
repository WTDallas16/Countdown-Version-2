import LZString from 'lz-string';
import type { CountdownSettings } from '../types';

export function compressState(state: CountdownSettings): string {
  try {
    const json = JSON.stringify(state);
    return LZString.compressToEncodedURIComponent(json);
  } catch (error) {
    console.error('Failed to compress state:', error);
    return '';
  }
}

export function decompressState(compressed: string): CountdownSettings | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json) as CountdownSettings;
  } catch (error) {
    console.error('Failed to decompress state:', error);
    return null;
  }
}

export function getStateFromURL(): CountdownSettings | null {
  const hash = window.location.hash;
  if (!hash || hash === '#') {
    console.log('🔍 No hash in URL');
    return null;
  }

  const match = hash.match(/^#state=(.+)$/);
  if (!match) {
    console.log('🔍 Hash exists but no state parameter:', hash);
    return null;
  }

  console.log('🔍 Found state in URL, decompressing...');
  const state = decompressState(match[1]);

  if (!state) {
    console.log('⚠️ Failed to decompress state from URL');
    return null;
  }

  console.log('🔍 Successfully decompressed URL state:', {
    photosCount: state.photos?.length,
  });

  return state;
}

export function updateURLWithState(state: CountdownSettings): void {
  const compressed = compressState(state);
  window.location.hash = `state=${compressed}`;
}

export function getCompressedSize(state: CountdownSettings): number {
  const compressed = compressState(state);
  return new Blob([compressed]).size;
}

export const MAX_SAFE_URL_SIZE = 50 * 1024; // 50KB
