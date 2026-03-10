import { useRef, useState, useCallback, useEffect } from 'react'

interface JoystickControllerProps {
  onMove: (x: number, y: number) => void
}

export function JoystickController({ onMove }: JoystickControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 })

  const JOYSTICK_SIZE = 120
  const KNOB_SIZE = 50
  const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setCenterPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })
    setIsActive(true)
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isActive) return

    const deltaX = clientX - centerPos.x
    const deltaY = clientY - centerPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    let x = deltaX
    let y = deltaY

    if (distance > MAX_DISTANCE) {
      x = (deltaX / distance) * MAX_DISTANCE
      y = (deltaY / distance) * MAX_DISTANCE
    }

    setPosition({ x, y })
    onMove(x / MAX_DISTANCE, y / MAX_DISTANCE)
  }, [isActive, centerPos, MAX_DISTANCE, onMove])

  const handleEnd = useCallback(() => {
    setIsActive(false)
    setPosition({ x: 0, y: 0 })
    onMove(0, 0)
  }, [onMove])

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [handleMove])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }, [handleEnd])

  // Mouse handlers for desktop testing
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const onMouseUp = () => {
      handleEnd()
    }

    if (isActive) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isActive, handleMove, handleEnd])

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none"
      style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          border: '3px solid rgba(100, 116, 139, 0.5)',
          boxShadow: `
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(59, 130, 246, 0.1)
          `
        }}
      >
        {/* Direction indicators */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 border-t-2 border-l-2 border-r-2 border-slate-500/50 rounded-t-full" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 border-b-2 border-l-2 border-r-2 border-slate-500/50 rounded-b-full" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-l-2 border-b-2 border-slate-500/50 rounded-l-full" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-b-2 border-slate-500/50 rounded-r-full" />
      </div>

      {/* Inner knob */}
      <div
        className="absolute rounded-full transition-transform duration-75"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          background: isActive
            ? 'linear-gradient(145deg, #3B82F6, #1E40AF)'
            : 'linear-gradient(145deg, #475569, #334155)',
          border: '2px solid rgba(148, 163, 184, 0.6)',
          boxShadow: isActive
            ? `0 4px 15px rgba(59, 130, 246, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)`
            : `0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)`
        }}
      >
        {/* Highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            left: '20%',
            top: '15%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%)',
            borderRadius: '50%'
          }}
        />
      </div>
    </div>
  )
}
