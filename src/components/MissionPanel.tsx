import { Mission } from '../context/GameContext'

interface MissionPanelProps {
  missions: Mission[]
  onClose: () => void
  onCompleteMission: (id: number) => void
}

export function MissionPanel({ missions, onClose, onCompleteMission }: MissionPanelProps) {
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
          border: '2px solid rgba(34, 197, 94, 0.4)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.15)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <h2
              className="text-xl font-black tracking-wide text-white"
              style={{ fontFamily: 'Russo One, sans-serif' }}
            >
              ACTIVE MISSIONS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <span className="text-xl text-slate-300">✕</span>
          </button>
        </div>

        {/* Missions list */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                mission.completed ? 'opacity-60' : ''
              }`}
              style={{
                background: mission.completed
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(51, 65, 85, 0.5)',
                border: mission.completed
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid rgba(100, 116, 139, 0.3)'
              }}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
                      border: '1px solid rgba(147, 197, 253, 0.3)'
                    }}
                  >
                    <span className="text-2xl">{mission.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-bold text-white truncate"
                        style={{ fontFamily: 'Exo 2, sans-serif' }}
                      >
                        {mission.title}
                      </h3>
                      {mission.completed && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                      {mission.description}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-700/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(mission.progress / mission.target) * 100}%`,
                            background: mission.completed
                              ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                              : 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🏆</span>
                    <span
                      className="text-sm font-bold text-amber-400"
                      style={{ fontFamily: 'Russo One, sans-serif' }}
                    >
                      +{mission.reward}
                    </span>
                  </div>
                </div>

                {/* Claim button */}
                {mission.progress >= mission.target && !mission.completed && (
                  <button
                    onClick={() => onCompleteMission(mission.id)}
                    className="w-full mt-3 py-2.5 rounded-lg font-bold text-white tracking-wide transition-all duration-200 active:scale-98"
                    style={{
                      fontFamily: 'Russo One, sans-serif',
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    CLAIM REWARD
                  </button>
                )}
              </div>
            </div>
          ))}
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
