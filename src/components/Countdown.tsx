import { useCountdown } from '../hooks/useCountdown';
import type { TextStyle } from '../types';
import { formatTimeUnit } from '../utils/countdown';

interface CountdownProps {
  targetDate: Date;
  textStyle: TextStyle;
}

const positionClasses: Record<string, string> = {
  'top-left': 'top-8 left-8 items-start text-left',
  'top-center': 'top-8 left-1/2 -translate-x-1/2 items-center text-center',
  'top-right': 'top-8 right-8 items-end text-right',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center',
  'bottom-left': 'bottom-8 left-8 items-start text-left',
  'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2 items-center text-center',
  'bottom-right': 'bottom-8 right-8 items-end text-right',
};

export function Countdown({ targetDate, textStyle }: CountdownProps) {
  const timeRemaining = useCountdown(targetDate);

  const textShadowStyle = textStyle.textShadow
    ? `${textStyle.shadowBlur}px ${textStyle.shadowBlur}px ${textStyle.shadowBlur * 2}px ${textStyle.shadowColor}`
    : 'none';

  const overlayStyle = textStyle.backgroundOverlay
    ? {
        backgroundColor: textStyle.overlayColor,
        opacity: textStyle.overlayOpacity,
      }
    : undefined;

  return (
    <div
      className={`fixed flex flex-col gap-4 ${positionClasses[textStyle.position]} z-10`}
      style={{
        fontFamily: textStyle.fontFamily,
      }}
    >
      {textStyle.backgroundOverlay && (
        <div
          className="absolute inset-0 -z-10 rounded-lg"
          style={overlayStyle}
        />
      )}

      <div
        className="relative px-6 py-4"
        style={{
          color: textStyle.color,
          fontSize: `${textStyle.fontSize}px`,
          textShadow: textShadowStyle,
        }}
      >
        <div className="font-bold mb-2">{textStyle.content}</div>

        {timeRemaining.isExpired ? (
          <div className="text-4xl font-bold">Event Started!</div>
        ) : (
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">
                {formatTimeUnit(timeRemaining.days)}
              </span>
              <span className="text-sm uppercase tracking-wider opacity-80">
                Days
              </span>
            </div>
            <span className="text-4xl font-bold opacity-60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">
                {formatTimeUnit(timeRemaining.hours)}
              </span>
              <span className="text-sm uppercase tracking-wider opacity-80">
                Hours
              </span>
            </div>
            <span className="text-4xl font-bold opacity-60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">
                {formatTimeUnit(timeRemaining.minutes)}
              </span>
              <span className="text-sm uppercase tracking-wider opacity-80">
                Minutes
              </span>
            </div>
            <span className="text-4xl font-bold opacity-60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">
                {formatTimeUnit(timeRemaining.seconds)}
              </span>
              <span className="text-sm uppercase tracking-wider opacity-80">
                Seconds
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
