import { HexColorPicker } from 'react-colorful';
import type { TextStyle, TextPosition } from '../types';
import { useState } from 'react';

interface TextCustomizerProps {
  textStyle: TextStyle;
  onUpdate: (style: Partial<TextStyle>) => void;
}

const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Raleway',
  'Ubuntu',
];

const POSITION_OPTIONS: { value: TextPosition; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

export function TextCustomizer({ textStyle, onUpdate }: TextCustomizerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);
  const [showOverlayColorPicker, setShowOverlayColorPicker] = useState(false);

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <input
          type="text"
          value={textStyle.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={textStyle.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {textStyle.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="200"
          value={textStyle.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <div className="flex gap-2">
          <button
            className="w-12 h-12 rounded border-2 border-gray-300"
            style={{ backgroundColor: textStyle.color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          <input
            type="text"
            value={textStyle.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {showColorPicker && (
          <div className="mt-2">
            <HexColorPicker
              color={textStyle.color}
              onChange={(color) => onUpdate({ color })}
            />
          </div>
        )}
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position
        </label>
        <div className="grid grid-cols-3 gap-2">
          {POSITION_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                textStyle.position === option.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => onUpdate({ position: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Shadow */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={textStyle.textShadow}
            onChange={(e) => onUpdate({ textShadow: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable Text Shadow
          </span>
        </label>

        {textStyle.textShadow && (
          <div className="ml-6 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Shadow Blur: {textStyle.shadowBlur}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={textStyle.shadowBlur}
                onChange={(e) =>
                  onUpdate({ shadowBlur: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Shadow Color
              </label>
              <div className="flex gap-2">
                <button
                  className="w-12 h-12 rounded border-2 border-gray-300"
                  style={{ backgroundColor: textStyle.shadowColor }}
                  onClick={() =>
                    setShowShadowColorPicker(!showShadowColorPicker)
                  }
                />
                <input
                  type="text"
                  value={textStyle.shadowColor}
                  onChange={(e) => onUpdate({ shadowColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {showShadowColorPicker && (
                <div className="mt-2">
                  <HexColorPicker
                    color={textStyle.shadowColor}
                    onChange={(color) => onUpdate({ shadowColor: color })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Overlay */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={textStyle.backgroundOverlay}
            onChange={(e) => onUpdate({ backgroundOverlay: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable Background Overlay
          </span>
        </label>

        {textStyle.backgroundOverlay && (
          <div className="ml-6 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Overlay Color
              </label>
              <div className="flex gap-2">
                <button
                  className="w-12 h-12 rounded border-2 border-gray-300"
                  style={{ backgroundColor: textStyle.overlayColor }}
                  onClick={() =>
                    setShowOverlayColorPicker(!showOverlayColorPicker)
                  }
                />
                <input
                  type="text"
                  value={textStyle.overlayColor}
                  onChange={(e) => onUpdate({ overlayColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {showOverlayColorPicker && (
                <div className="mt-2">
                  <HexColorPicker
                    color={textStyle.overlayColor}
                    onChange={(color) => onUpdate({ overlayColor: color })}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Opacity: {Math.round(textStyle.overlayOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={textStyle.overlayOpacity}
                onChange={(e) =>
                  onUpdate({ overlayOpacity: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
