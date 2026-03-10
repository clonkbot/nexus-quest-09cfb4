interface MinimapProps {
  playerPosition: { x: number; z: number }
}

export function MinimapComponent({ playerPosition }: MinimapProps) {
  const mapSize = 80 // pixels
  const worldSize = 50 // world units diameter

  // Convert world position to minimap position
  const mapX = ((playerPosition.x + worldSize / 2) / worldSize) * mapSize
  const mapY = ((playerPosition.z + worldSize / 2) / worldSize) * mapSize

  // Points of interest
  const pois = [
    { x: -15, z: -12, icon: '🏰', label: 'Tower' },
    { x: 8, z: 3, icon: '💎', label: 'Crystal' },
    { x: -6, z: 8, icon: '💎', label: 'Crystal' },
    { x: 4, z: -9, icon: '💎', label: 'Crystal' }
  ]

  return (
    <div className="relative">
      {/* Minimap container */}
      <div
        className="relative overflow-hidden"
        style={{
          width: mapSize,
          height: mapSize,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
          border: '2px solid rgba(100, 116, 139, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Terrain representation */}
        <div
          className="absolute rounded-full"
          style={{
            width: '85%',
            height: '85%',
            left: '7.5%',
            top: '7.5%',
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.4) 0%, rgba(46, 125, 50, 0.3) 70%, transparent 100%)'
          }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: `${mapSize / 4}px ${mapSize / 4}px`
          }}
        />

        {/* POIs */}
        {pois.map((poi, index) => {
          const poiX = ((poi.x + worldSize / 2) / worldSize) * mapSize
          const poiY = ((poi.z + worldSize / 2) / worldSize) * mapSize
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: poiX,
                top: poiY,
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))'
              }}
            >
              {poi.icon}
            </div>
          )
        })}

        {/* Player marker */}
        <div
          className="absolute"
          style={{
            left: mapX,
            top: mapY,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Pulse ring */}
          <div
            className="absolute w-4 h-4 rounded-full animate-ping"
            style={{
              left: '-8px',
              top: '-8px',
              background: 'rgba(59, 130, 246, 0.4)'
            }}
          />
          {/* Player dot */}
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              border: '2px solid white',
              boxShadow: '0 0 6px rgba(59, 130, 246, 0.8)'
            }}
          />
        </div>

        {/* Compass indicator */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400"
          style={{ fontFamily: 'Russo One, sans-serif' }}
        >
          N
        </div>
      </div>

      {/* Map label */}
      <div
        className="mt-1 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider"
        style={{ fontFamily: 'Russo One, sans-serif' }}
      >
        MINIMAP
      </div>
    </div>
  )
}
