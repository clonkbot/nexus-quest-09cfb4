import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { GameScene } from './components/GameScene'
import { GameHUD } from './components/GameHUD'
import { JoystickController } from './components/JoystickController'
import { MissionPanel } from './components/MissionPanel'
import { SkillsPanel } from './components/SkillsPanel'
import { LoadingScreen } from './components/LoadingScreen'
import { HealthBar } from './components/HealthBar'
import { MinimapComponent } from './components/Minimap'
import { GameProvider, useGame } from './context/GameContext'

function GameApp() {
  const { playerPosition, health, maxHealth, xp, level, missions, skills, activateSkill, completeMission } = useGame()
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 })
  const [showMissions, setShowMissions] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setJoystickInput({ x, y })
  }, [])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden relative">
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 12, 16], fov: 55 }}
        className="touch-none"
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <GameScene joystickInput={joystickInput} />
        </Suspense>
      </Canvas>

      {/* Game HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 pointer-events-auto">
          <GameHUD
            xp={xp}
            level={level}
            onMissionsClick={() => setShowMissions(true)}
            onSkillsClick={() => setShowSkills(true)}
          />
        </div>

        {/* Health Bar */}
        <div className="absolute top-20 md:top-24 left-3 md:left-5 pointer-events-none">
          <HealthBar current={health} max={maxHealth} />
        </div>

        {/* Minimap */}
        <div className="absolute top-20 md:top-24 right-3 md:right-5 pointer-events-none">
          <MinimapComponent playerPosition={playerPosition} />
        </div>

        {/* Joystick - Bottom Left */}
        <div className="absolute bottom-6 left-4 md:bottom-10 md:left-8 pointer-events-auto">
          <JoystickController onMove={handleJoystickMove} />
        </div>

        {/* Action Buttons - Bottom Right */}
        <div className="absolute bottom-6 right-4 md:bottom-10 md:right-8 pointer-events-auto flex gap-2 md:gap-3">
          <button
            onClick={() => activateSkill(0)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50 flex items-center justify-center active:scale-90 transition-transform"
            disabled={skills[0]?.cooldown > 0}
          >
            <span className="text-xl md:text-2xl">⚡</span>
          </button>
          <button
            onClick={() => activateSkill(1)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-orange-300 shadow-lg shadow-orange-500/50 flex items-center justify-center active:scale-90 transition-transform"
            disabled={skills[1]?.cooldown > 0}
          >
            <span className="text-xl md:text-2xl">🔥</span>
          </button>
          <button
            onClick={() => activateSkill(2)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-300 shadow-lg shadow-green-500/50 flex items-center justify-center active:scale-90 transition-transform"
            disabled={skills[2]?.cooldown > 0}
          >
            <span className="text-xl md:text-2xl">🛡️</span>
          </button>
        </div>
      </div>

      {/* Mission Panel */}
      {showMissions && (
        <MissionPanel
          missions={missions}
          onClose={() => setShowMissions(false)}
          onCompleteMission={completeMission}
        />
      )}

      {/* Skills Panel */}
      {showSkills && (
        <SkillsPanel
          skills={skills}
          onClose={() => setShowSkills(false)}
        />
      )}

      {/* Footer */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] md:text-xs text-slate-500/60 font-light tracking-wide">
          Requested by @flambons · Built by @clonkbot
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}
