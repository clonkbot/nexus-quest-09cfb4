import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky, Stars, Float, MeshWobbleMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Character } from './Character'
import { useGame } from '../context/GameContext'

interface GameSceneProps {
  joystickInput: { x: number; y: number }
}

// Low-poly tree
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.6, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[0.9, 1.8, 6]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.65, 1.3, 6]} />
        <meshStandardMaterial color="#388E3C" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <coneGeometry args={[0.4, 0.9, 6]} />
        <meshStandardMaterial color="#43A047" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Rock formation
function Rock({ position, scale = 1, rotation = 0 }: { position: [number, number, number]; scale?: number; rotation?: number }) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#78909C" roughness={0.95} flatShading />
    </mesh>
  )
}

// Magical Crystal
function Crystal({ position, color = '#4FC3F7' }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={ref} position={position} castShadow>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Crystal glow */}
      <pointLight position={position} color={color} intensity={2} distance={4} />
    </Float>
  )
}

// Ancient Tower
function Tower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.5, 3, 8]} />
        <meshStandardMaterial color="#455A64" roughness={0.9} />
      </mesh>
      {/* Middle section */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[1.8, 2, 2, 8]} />
        <meshStandardMaterial color="#546E7A" roughness={0.9} />
      </mesh>
      {/* Top section */}
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.8, 2, 8]} />
        <meshStandardMaterial color="#607D8B" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 7.8, 0]} castShadow>
        <coneGeometry args={[2, 2.5, 8]} />
        <meshStandardMaterial color="#37474F" roughness={0.8} />
      </mesh>
      {/* Tower crystal */}
      <Float speed={1.5} rotationIntensity={1}>
        <mesh position={[0, 9.5, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#E040FB"
            emissive="#E040FB"
            emissiveIntensity={1}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>
      <pointLight position={[0, 9.5, 0]} color="#E040FB" intensity={5} distance={15} />
    </group>
  )
}

// Bridge
function Bridge({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Planks */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[2, 0.2, 6]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.9} />
      </mesh>
      {/* Rails */}
      <mesh position={[-0.9, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 0.8, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 0.8, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Floating Island Platform
function FloatingPlatform({ position, size = 4 }: { position: [number, number, number]; size?: number }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
  })

  return (
    <group ref={ref} position={position}>
      {/* Top grass */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[size, size * 0.9, 0.6, 12]} />
        <meshStandardMaterial color="#66BB6A" roughness={0.9} />
      </mesh>
      {/* Dirt layer */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[size * 0.9, size * 0.6, 1.2, 12]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.95} />
      </mesh>
      {/* Rocky bottom */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <coneGeometry args={[size * 0.5, 1.5, 8]} />
        <meshStandardMaterial color="#78909C" roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

// Water
function Water() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const material = ref.current.material as THREE.ShaderMaterial
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const waterShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1565C0') },
      uColorDeep: { value: new THREE.Color('#0D47A1') }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.x * 2.0 + uTime) * 0.15 + sin(pos.y * 2.0 + uTime * 1.5) * 0.1;
        pos.z += wave;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uColorDeep;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vec3 color = mix(uColorDeep, uColor, vWave + 0.5);
        gl_FragColor = vec4(color, 0.85);
      }
    `,
    transparent: true
  }), [])

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100, 64, 64]} />
      <shaderMaterial {...waterShader} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Main Ground/Island
function MainIsland() {
  return (
    <group>
      {/* Main platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[25, 22, 2, 24]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.9} />
      </mesh>
      {/* Dirt/rock beneath */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[22, 15, 3, 24]} />
        <meshStandardMaterial color="#795548" roughness={0.95} />
      </mesh>
      {/* Bottom rocks */}
      <mesh position={[0, -4.5, 0]}>
        <coneGeometry args={[12, 4, 16]} />
        <meshStandardMaterial color="#607D8B" roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

// Path markers
function PathStone({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[0.5, 0.6, 0.15, 8]} />
      <meshStandardMaterial color="#BCAAA4" roughness={0.9} />
    </mesh>
  )
}

export function GameScene({ joystickInput }: GameSceneProps) {
  const { setPlayerPosition } = useGame()

  // Generate tree positions
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      const radius = 12 + Math.random() * 8
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ])
    }
    return positions
  }, [])

  // Generate rock positions
  const rockPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number; rotation: number }[] = []
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 15
      positions.push({
        pos: [Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius],
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI
      })
    }
    return positions
  }, [])

  // Crystal positions
  const crystalPositions: { pos: [number, number, number]; color: string }[] = [
    { pos: [8, 1.5, 3], color: '#4FC3F7' },
    { pos: [-6, 1.5, 8], color: '#BA68C8' },
    { pos: [4, 1.5, -9], color: '#81C784' },
    { pos: [-10, 1.5, -5], color: '#FFB74D' },
    { pos: [12, 1.5, -3], color: '#F48FB1' }
  ]

  // Path stone positions
  const pathStones = useMemo(() => {
    const stones: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const t = i / 12
      stones.push([
        Math.sin(t * Math.PI * 4) * 4,
        0.5,
        t * 20 - 10
      ])
    }
    return stones
  }, [])

  return (
    <>
      {/* Sky and atmosphere */}
      <Sky sunPosition={[100, 50, 100]} turbidity={0.3} rayleigh={0.5} />
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#FFF9C4" />

      {/* Fog */}
      <fog attach="fog" args={['#87CEEB', 30, 80]} />

      {/* Water */}
      <Water />

      {/* Main Island */}
      <MainIsland />

      {/* Character */}
      <Character joystickInput={joystickInput} onPositionChange={setPlayerPosition} />

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} scale={0.8 + Math.random() * 0.5} />
      ))}

      {/* Rocks */}
      {rockPositions.map((rock, i) => (
        <Rock key={`rock-${i}`} position={rock.pos} scale={rock.scale} rotation={rock.rotation} />
      ))}

      {/* Crystals */}
      {crystalPositions.map((crystal, i) => (
        <Crystal key={`crystal-${i}`} position={crystal.pos} color={crystal.color} />
      ))}

      {/* Tower */}
      <Tower position={[-15, 0, -12]} />

      {/* Floating platforms */}
      <FloatingPlatform position={[20, 3, 5]} size={3} />
      <FloatingPlatform position={[-18, 4, 10]} size={2.5} />
      <FloatingPlatform position={[15, 5, -15]} size={2} />

      {/* Bridge */}
      <Bridge position={[8, 0.5, -5]} rotation={Math.PI / 4} />

      {/* Path stones */}
      {pathStones.map((pos, i) => (
        <PathStone key={`stone-${i}`} position={pos} />
      ))}

      {/* Contact shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={60}
        blur={2}
        far={10}
        color="#1a1a2e"
      />
    </>
  )
}
