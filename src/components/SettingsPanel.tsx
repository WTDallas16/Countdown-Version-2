import { useState } from 'react';
import type { CountdownSettings, PhotoMode } from '../types';
import type { SavedCountdown } from '../types/countdown-manager';
import { DateInput } from './DateInput';
import { PhotoUploader } from './PhotoUploader';
import { TextCustomizer } from './TextCustomizer';
import { ShareButton } from './ShareButton';
import { CountdownManager } from './CountdownManager';

interface SettingsPanelProps {
  settings: CountdownSettings;
  onSettingsChange: (settings: CountdownSettings) => void;
  onShare: () => string | null;
  countdowns: SavedCountdown[];
  activeCountdownId: string | null;
  onCreateCountdown: (name: string) => void;
  onDeleteCountdown: (id: string) => void;
  onRenameCountdown: (id: string, newName: string) => void;
  onSwitchCountdown: (id: string) => void;
  onDuplicateCountdown: (id: string) => void;
  getStorageUsage: () => {
    usedBytes: number;
    usedKB: number;
    usedMB: number;
    percentUsed: number;
    limitMB: number;
  };
}

const SLIDESHOW_INTERVALS = [
  { value: 3, label: '3 seconds' },
  { value: 5, label: '5 seconds' },
  { value: 10, label: '10 seconds' },
  { value: 30, label: '30 seconds' },
];

export function SettingsPanel({
  settings,
  onSettingsChange,
  onShare,
  countdowns,
  activeCountdownId,
  onCreateCountdown,
  onDeleteCountdown,
  onRenameCountdown,
  onSwitchCountdown,
  onDuplicateCountdown,
  getStorageUsage,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('countdowns');
  const storageInfo = getStorageUsage();

  const updateSettings = (updates: Partial<CountdownSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const handlePhotosAdd = (newPhotos: typeof settings.photos) => {
    updateSettings({ photos: [...settings.photos, ...newPhotos] });
  };

  const handlePhotoDelete = (id: string) => {
    const newPhotos = settings.photos.filter((p) => p.id !== id);
    updateSettings({
      photos: newPhotos,
      currentPhotoIndex: Math.min(settings.currentPhotoIndex, newPhotos.length - 1),
    });
  };

  const handlePhotoSelect = (index: number) => {
    updateSettings({ currentPhotoIndex: index, photoMode: 'manual' });
  };

  const sections = [
    { id: 'countdowns', label: 'My Countdowns', icon: '📋' },
    { id: 'date', label: 'Date & Time', icon: '📅' },
    { id: 'photos', label: 'Photos', icon: '🖼️' },
    { id: 'text', label: 'Text Style', icon: '✏️' },
    { id: 'share', label: 'Share', icon: '🔗' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Toggle Settings"
        title="Settings"
      >
        <span className="text-2xl">{isOpen ? '×' : '⚙️'}</span>
      </button>

      {/* Quick Share Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setActiveSection('share');
          }}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          title="Share Countdown"
        >
          <span>🔗</span>
          <span className="text-sm font-medium">Share</span>
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Settings Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

          {/* Section Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>

          {/* My Countdowns Section */}
          {activeSection === 'countdowns' && (
            <>
              <CountdownManager
                countdowns={countdowns}
                activeCountdownId={activeCountdownId}
                onSwitch={onSwitchCountdown}
                onCreate={onCreateCountdown}
                onRename={onRenameCountdown}
                onDelete={onDeleteCountdown}
                onDuplicate={onDuplicateCountdown}
              />

              {/* Storage Usage Indicator */}
              <div className={`mt-4 p-3 rounded-lg border ${
                storageInfo.percentUsed > 80
                  ? 'bg-red-50 border-red-200'
                  : storageInfo.percentUsed > 60
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Storage Usage
                  </span>
                  <span className={`text-sm font-bold ${
                    storageInfo.percentUsed > 80
                      ? 'text-red-600'
                      : storageInfo.percentUsed > 60
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}>
                    {storageInfo.usedMB} MB / ~{storageInfo.limitMB} MB ({storageInfo.percentUsed}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      storageInfo.percentUsed > 80
                        ? 'bg-red-500'
                        : storageInfo.percentUsed > 60
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
                  />
                </div>
                {storageInfo.percentUsed > 80 && (
                  <p className="text-xs text-red-600 mt-2">
                    Storage is almost full! Delete old countdowns or remove photos to free up space.
                  </p>
                )}
                {storageInfo.percentUsed > 60 && storageInfo.percentUsed <= 80 && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Storage is getting full. Consider removing unused countdowns or photos.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Date & Time Section */}
          {activeSection === 'date' && (
            <div className="space-y-4">
              <DateInput
                targetDate={new Date(settings.targetDate)}
                onChange={(date) =>
                  updateSettings({ targetDate: date.toISOString() })
                }
              />
            </div>
          )}

          {/* Photos Section */}
          {activeSection === 'photos' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slideshow', 'random', 'manual'] as PhotoMode[]).map(
                    (mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSettings({ photoMode: mode })}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors capitalize ${
                          settings.photoMode === mode
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  )}
                </div>
              </div>

              {settings.photoMode === 'slideshow' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slideshow Interval
                  </label>
                  <select
                    value={settings.slideshowInterval}
                    onChange={(e) =>
                      updateSettings({
                        slideshowInterval: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SLIDESHOW_INTERVALS.map((interval) => (
                      <option key={interval.value} value={interval.value}>
                        {interval.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <PhotoUploader
                photos={settings.photos}
                onPhotosAdd={handlePhotosAdd}
                onPhotoDelete={handlePhotoDelete}
                onPhotoSelect={handlePhotoSelect}
                currentIndex={settings.currentPhotoIndex}
              />
            </div>
          )}

          {/* Text Style Section */}
          {activeSection === 'text' && (
            <TextCustomizer
              textStyle={settings.textStyle}
              onUpdate={(updates) =>
                updateSettings({
                  textStyle: { ...settings.textStyle, ...updates },
                })
              }
            />
          )}

          {/* Share Section */}
          {activeSection === 'share' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Share Your Countdown
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate a shareable link with all your settings and photos
                  encoded in the URL.
                </p>
                <ShareButton settings={settings} onShare={onShare} />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  How to Share
                </h3>
                <p className="text-sm text-gray-600">
                  Click the button above to generate a shareable link. The link contains all your settings and photos, so anyone who opens it will see your countdown exactly as you've configured it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
