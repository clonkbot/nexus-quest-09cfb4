interface GameHUDProps {
  xp: number
  level: number
  onMissionsClick: () => void
  onSkillsClick: () => void
}

export function GameHUD({ xp, level, onMissionsClick, onSkillsClick }: GameHUDProps) {
  const xpForNextLevel = level * 100
  const xpProgress = (xp / xpForNextLevel) * 100

  return (
    <div className="flex items-center justify-between p-3 md:p-4">
      {/* Left side - Level & XP */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Level badge */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px'
          }}
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
            }}
          />
          <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-b from-amber-400/20 to-transparent" />
          <span className="relative font-black text-lg text-white drop-shadow-lg" style={{ fontFamily: 'Russo One, sans-serif' }}>
            {level}
          </span>
        </div>

        {/* XP bar */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] md:text-xs font-bold text-amber-300/80 uppercase tracking-wider" style={{ fontFamily: 'Russo One, sans-serif' }}>
            Level {level}
          </span>
          <div
            className="w-24 md:w-36 h-3 md:h-4 rounded-full overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${xpProgress}%`,
                background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #FCD34D)',
                boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
              }}
            />
          </div>
          <span className="text-[9px] md:text-[10px] text-slate-400" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            {xp} / {xpForNextLevel} XP
          </span>
        </div>
      </div>

      {/* Center - Game title */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
        <h1
          className="text-xl font-black tracking-widest"
          style={{
            fontFamily: 'Russo One, sans-serif',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(148, 163, 184, 0.3)'
          }}
        >
          NEXUS QUEST
        </h1>
      </div>

      {/* Right side - Menu buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMissionsClick}
          className="group relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)',
            border: '2px solid rgba(134, 239, 172, 0.5)',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
          }}
        >
          <span className="text-base md:text-lg">📜</span>
          <span className="text-xs md:text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'Russo One, sans-serif' }}>
            MISSIONS
          </span>
        </button>

        <button
          onClick={onSkillsClick}
          className="group relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(109, 40, 217, 0.9) 100%)',
            border: '2px solid rgba(196, 181, 253, 0.5)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
          }}
        >
          <span className="text-base md:text-lg">⚔️</span>
          <span className="text-xs md:text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'Russo One, sans-serif' }}>
            SKILLS
          </span>
        </button>
      </div>
    </div>
  )
}
