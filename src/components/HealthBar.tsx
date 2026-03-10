interface HealthBarProps {
  current: number
  max: number
}

export function HealthBar({ current, max }: HealthBarProps) {
  const percentage = (current / max) * 100
  const isLow = percentage <= 30
  const isCritical = percentage <= 15

  return (
    <div className="flex items-center gap-2">
      {/* Heart icon */}
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
          isCritical ? 'animate-pulse' : ''
        }`}
        style={{
          background: isLow
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9))'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isLow
            ? '0 4px 15px rgba(239, 68, 68, 0.4)'
            : '0 4px 15px rgba(34, 197, 94, 0.4)'
        }}
      >
        <span className="text-lg md:text-xl">❤️</span>
      </div>

      {/* Bar container */}
      <div className="relative">
        <div
          className="w-28 md:w-40 h-5 md:h-6 rounded-lg overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(100, 116, 139, 0.4)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0.5 rounded-md opacity-30"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 8px,
                rgba(255, 255, 255, 0.1) 8px,
                rgba(255, 255, 255, 0.1) 10px
              )`
            }}
          />

          {/* Health fill */}
          <div
            className="h-full rounded-md transition-all duration-300 relative overflow-hidden"
            style={{
              width: `${percentage}%`,
              background: isLow
                ? 'linear-gradient(90deg, #DC2626, #EF4444, #F87171)'
                : 'linear-gradient(90deg, #16A34A, #22C55E, #4ADE80)',
              boxShadow: isLow
                ? '0 0 10px rgba(239, 68, 68, 0.6)'
                : '0 0 10px rgba(34, 197, 94, 0.6)'
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)'
              }}
            />
          </div>
        </div>

        {/* Health text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[10px] md:text-xs font-bold text-white drop-shadow-lg"
            style={{ fontFamily: 'Russo One, sans-serif' }}
          >
            {current} / {max}
          </span>
        </div>
      </div>
    </div>
  )
}
