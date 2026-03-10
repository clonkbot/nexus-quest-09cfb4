import { Skill } from '../context/GameContext'

interface SkillsPanelProps {
  skills: Skill[]
  onClose: () => void
}

export function SkillsPanel({ skills, onClose }: SkillsPanelProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl animate-[slideUp_0.3s_ease-out]"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚔️</span>
            <h2
              className="text-xl font-black tracking-wide text-white"
              style={{ fontFamily: 'Russo One, sans-serif' }}
            >
              SKILLS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <span className="text-xl text-slate-300">✕</span>
          </button>
        </div>

        {/* Skills list */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="relative rounded-xl overflow-hidden"
              style={{
                background: 'rgba(51, 65, 85, 0.5)',
                border: '1px solid rgba(100, 116, 139, 0.3)'
              }}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Skill icon */}
                  <div
                    className="relative w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: getSkillGradient(skill.id),
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: getSkillShadow(skill.id)
                    }}
                  >
                    <span className="text-3xl">{skill.icon}</span>
                    {/* Level badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span className="text-xs font-bold text-white">{skill.level}</span>
                    </div>
                  </div>

                  {/* Skill info */}
                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg text-white mb-1"
                      style={{ fontFamily: 'Russo One, sans-serif' }}
                    >
                      {skill.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                      {skill.description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3">
                      {skill.damage && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20">
                          <span className="text-xs">💥</span>
                          <span className="text-xs font-bold text-red-400" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                            {skill.damage} DMG
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20">
                        <span className="text-xs">⏱️</span>
                        <span className="text-xs font-bold text-blue-400" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                          {skill.maxCooldown}s CD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cooldown indicator */}
                {skill.cooldown > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                        style={{
                          width: `${((skill.maxCooldown - skill.cooldown) / skill.maxCooldown) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {skill.cooldown}s
                    </span>
                  </div>
                )}

                {/* Upgrade hint */}
                <div className="mt-3 pt-3 border-t border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                      Next upgrade: +{Math.round(skill.damage ? skill.damage * 0.2 : 10)} power
                    </span>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-wide transition-all duration-200 active:scale-95"
                      style={{
                        fontFamily: 'Russo One, sans-serif',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(109, 40, 217, 0.8))',
                        border: '1px solid rgba(196, 181, 253, 0.3)'
                      }}
                    >
                      UPGRADE (500 XP)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            Tap skill buttons during gameplay to activate abilities
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

function getSkillGradient(id: number): string {
  switch (id) {
    case 1:
      return 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)'
    case 2:
      return 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)'
    case 3:
      return 'linear-gradient(135deg, #22C55E 0%, #059669 100%)'
    default:
      return 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
  }
}

function getSkillShadow(id: number): string {
  switch (id) {
    case 1:
      return '0 4px 20px rgba(6, 182, 212, 0.4)'
    case 2:
      return '0 4px 20px rgba(249, 115, 22, 0.4)'
    case 3:
      return '0 4px 20px rgba(34, 197, 94, 0.4)'
    default:
      return '0 4px 20px rgba(139, 92, 246, 0.4)'
  }
}
