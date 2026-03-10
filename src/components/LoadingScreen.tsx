import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing world...')
  const [isExiting, setIsExiting] = useState(false)

  const loadingStages = [
    'Initializing world...',
    'Loading terrain...',
    'Spawning trees...',
    'Placing crystals...',
    'Building tower...',
    'Preparing character...',
    'Almost ready...'
  ]

  useEffect(() => {
    const duration = 2500 // Total loading time
    const interval = 50 // Update every 50ms
    const steps = duration / interval

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newProgress = Math.min((currentStep / steps) * 100, 100)
      setProgress(newProgress)

      // Update loading text based on progress
      const stageIndex = Math.floor((newProgress / 100) * (loadingStages.length - 1))
      setLoadingText(loadingStages[stageIndex])

      if (newProgress >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(onComplete, 500)
        }, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-indigo-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Logo/Title */}
      <div className="relative mb-12">
        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-2xl opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)'
          }}
        />

        <h1
          className="relative text-4xl md:text-6xl font-black tracking-widest"
          style={{
            fontFamily: 'Russo One, sans-serif',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A5B4FC 50%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(129, 140, 248, 0.5)'
          }}
        >
          NEXUS QUEST
        </h1>

        <p
          className="text-center text-indigo-300/60 text-sm md:text-base mt-2 tracking-[0.3em] uppercase"
          style={{ fontFamily: 'Exo 2, sans-serif' }}
        >
          Adventure Awaits
        </p>
      </div>

      {/* Loading bar container */}
      <div className="relative w-64 md:w-80">
        {/* Background */}
        <div
          className="h-3 md:h-4 rounded-full overflow-hidden"
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Progress fill */}
          <div
            className="h-full rounded-full transition-all duration-100 relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4F46E5, #818CF8, #A5B4FC)',
              boxShadow: '0 0 20px rgba(129, 140, 248, 0.6)'
            }}
          >
            {/* Animated shine */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shine 1.5s infinite'
              }}
            />
          </div>
        </div>

        {/* Progress percentage */}
        <div className="flex justify-between items-center mt-3">
          <span
            className="text-xs md:text-sm text-indigo-300/80"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
          >
            {loadingText}
          </span>
          <span
            className="text-sm md:text-base font-bold text-indigo-200"
            style={{ fontFamily: 'Russo One, sans-serif' }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
        }
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  )
}
