import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Mission {
  id: number
  title: string
  description: string
  reward: number
  completed: boolean
  progress: number
  target: number
  icon: string
}

export interface Skill {
  id: number
  name: string
  description: string
  cooldown: number
  maxCooldown: number
  icon: string
  level: number
  damage?: number
}

interface GameState {
  playerPosition: { x: number; z: number }
  health: number
  maxHealth: number
  xp: number
  level: number
  missions: Mission[]
  skills: Skill[]
  setPlayerPosition: (pos: { x: number; z: number }) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  addXP: (amount: number) => void
  activateSkill: (index: number) => void
  completeMission: (id: number) => void
  updateMissionProgress: (id: number, progress: number) => void
}

const initialMissions: Mission[] = [
  {
    id: 1,
    title: 'Crystal Hunter',
    description: 'Collect 5 magical crystals scattered around the map',
    reward: 150,
    completed: false,
    progress: 0,
    target: 5,
    icon: '💎'
  },
  {
    id: 2,
    title: 'Explorer',
    description: 'Visit all 4 corners of the mystical island',
    reward: 200,
    completed: false,
    progress: 0,
    target: 4,
    icon: '🗺️'
  },
  {
    id: 3,
    title: 'Tower Seeker',
    description: 'Find and activate the ancient tower',
    reward: 300,
    completed: false,
    progress: 0,
    target: 1,
    icon: '🏰'
  },
  {
    id: 4,
    title: 'Nature Walker',
    description: 'Pass through the enchanted forest',
    reward: 100,
    completed: false,
    progress: 0,
    target: 1,
    icon: '🌲'
  }
]

const initialSkills: Skill[] = [
  {
    id: 1,
    name: 'Lightning Strike',
    description: 'Unleash a powerful bolt of lightning that damages enemies in range',
    cooldown: 0,
    maxCooldown: 5,
    icon: '⚡',
    level: 1,
    damage: 50
  },
  {
    id: 2,
    name: 'Fireball',
    description: 'Launch a blazing fireball that explodes on impact',
    cooldown: 0,
    maxCooldown: 8,
    icon: '🔥',
    level: 1,
    damage: 75
  },
  {
    id: 3,
    name: 'Shield Barrier',
    description: 'Create a protective barrier that absorbs incoming damage',
    cooldown: 0,
    maxCooldown: 12,
    icon: '🛡️',
    level: 1
  }
]

const GameContext = createContext<GameState | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 })
  const [health, setHealth] = useState(100)
  const [maxHealth] = useState(100)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
  const [skills, setSkills] = useState<Skill[]>(initialSkills)

  const takeDamage = useCallback((amount: number) => {
    setHealth(prev => Math.max(0, prev - amount))
  }, [])

  const heal = useCallback((amount: number) => {
    setHealth(prev => Math.min(maxHealth, prev + amount))
  }, [maxHealth])

  const addXP = useCallback((amount: number) => {
    setXp(prev => {
      const newXp = prev + amount
      const xpForNextLevel = level * 100
      if (newXp >= xpForNextLevel) {
        setLevel(l => l + 1)
        return newXp - xpForNextLevel
      }
      return newXp
    })
  }, [level])

  const activateSkill = useCallback((index: number) => {
    setSkills(prev => {
      const newSkills = [...prev]
      if (newSkills[index] && newSkills[index].cooldown === 0) {
        newSkills[index] = { ...newSkills[index], cooldown: newSkills[index].maxCooldown }

        // Start cooldown timer
        const interval = setInterval(() => {
          setSkills(current => {
            const updated = [...current]
            if (updated[index].cooldown > 0) {
              updated[index] = { ...updated[index], cooldown: updated[index].cooldown - 1 }
            } else {
              clearInterval(interval)
            }
            return updated
          })
        }, 1000)
      }
      return newSkills
    })
  }, [])

  const completeMission = useCallback((id: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && m.progress >= m.target && !m.completed) {
        addXP(m.reward)
        return { ...m, completed: true }
      }
      return m
    }))
  }, [addXP])

  const updateMissionProgress = useCallback((id: number, progress: number) => {
    setMissions(prev => prev.map(m =>
      m.id === id ? { ...m, progress: Math.min(m.target, progress) } : m
    ))
  }, [])

  return (
    <GameContext.Provider value={{
      playerPosition,
      health,
      maxHealth,
      xp,
      level,
      missions,
      skills,
      setPlayerPosition,
      takeDamage,
      heal,
      addXP,
      activateSkill,
      completeMission,
      updateMissionProgress
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
