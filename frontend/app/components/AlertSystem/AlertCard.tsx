import React from 'react';

export type AlertLevel = 'advisory' | 'signal2' | 'critical' | 'safe';

interface AlertCardProps {
  level: AlertLevel;
  title: string;
  description: string;
  timeframe: string;
  status: string;
  iconUrl?: string;
  actions?: Array<{
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

const alertStyles = {
  advisory: {
    bg: 'linear-gradient(to bottom, #8b0000, #7a0000)',
    textColor: '#f5e6d3',
    accentColor: '#4a0e0e',
  },
  signal2: {
    bg: 'linear-gradient(to right, #fe9a00, #ff6900)',
    textColor: '#fef3c6',
    accentColor: '#ffffff',
  },
  critical: {
    bg: 'linear-gradient(to right, #e7000b, #c10007)',
    textColor: '#fef2f2',
    accentColor: '#ffffff',
  },
  safe: {
    bg: 'linear-gradient(to right, #00c950, #009966)',
    textColor: '#dcfce7',
    accentColor: '#ffffff',
  },
};

export const AlertCard: React.FC<AlertCardProps> = ({
  level,
  title,
  description,
  timeframe,
  status,
  iconUrl,
  actions,
}) => {
  const styles = alertStyles[level];

  return (
    <div
      className="h-auto min-h-[192px] overflow-hidden relative rounded-2xl shrink-0 w-full shadow-lg"
      style={{
        background: styles.bg,
      }}
      data-alert-level={level}
    >
      <div className="absolute inset-0" style={{ background: styles.bg }} />

      <div className="absolute inset-0 flex gap-6 items-start left-0 pt-8 px-8 w-full">
        {/* Icon Container */}
        <div
          className="relative rounded-2xl shrink-0 size-14 flex items-center justify-center"
          style={{
            backgroundColor: level === 'critical' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            opacity: level === 'critical' ? 0.5 : 1,
          }}
        >
          {iconUrl && (
            <img
              alt=""
              className="block max-w-none size-7"
              src={iconUrl}
            />
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 h-auto min-h-fit relative">
          <div className="flex flex-col gap-2 w-full">
            {/* Title */}
            <h3
              className="font-bold text-2xl leading-8 whitespace-pre-wrap"
              style={{ color: styles.accentColor }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="text-base leading-6.5 whitespace-pre-wrap"
              style={{ color: styles.textColor }}
            >
              {description}
            </p>

            {/* Timeframe and Status */}
            <div className="flex gap-4 items-center h-5 mt-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-sm leading-5"
                  style={{ color: styles.textColor }}
                >
                  {timeframe}
                </span>
              </div>
              <span
                className="text-sm leading-5"
                style={{ color: styles.textColor }}
              >
                •
              </span>
              <span
                className="text-sm leading-5"
                style={{ color: styles.textColor }}
              >
                {status}
              </span>
            </div>

            {/* Action Buttons */}
            {actions && actions.length > 0 && (
              <div className="flex gap-3 mt-4">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-6 py-3 rounded-2xl font-bold text-base leading-6 whitespace-nowrap transition-all ${
                      action.variant === 'primary'
                        ? 'bg-white text-red-700 hover:bg-gray-100'
                        : 'bg-white/20 border-2 border-white text-white hover:bg-white/30'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
