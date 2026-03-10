import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CharacterProps {
  joystickInput: { x: number; y: number }
  onPositionChange: (pos: { x: number; z: number }) => void
}

export function Character({ joystickInput, onPositionChange }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const bodyRef = useRef<THREE.Mesh>(null!)
  const { camera } = useThree()

  const velocity = useRef({ x: 0, z: 0 })
  const position = useRef({ x: 0, y: 0.8, z: 0 })
  const targetRotation = useRef(0)
  const bobPhase = useRef(0)
  const isMoving = useRef(false)

  const SPEED = 8
  const ACCELERATION = 12
  const FRICTION = 8
  const BOUNDS = 22

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Handle input
    const inputX = joystickInput.x
    const inputZ = -joystickInput.y // Invert for proper forward/back

    const inputMagnitude = Math.sqrt(inputX * inputX + inputZ * inputZ)
    isMoving.current = inputMagnitude > 0.1

    if (isMoving.current) {
      // Accelerate towards input direction
      velocity.current.x += (inputX * SPEED - velocity.current.x) * ACCELERATION * delta
      velocity.current.z += (inputZ * SPEED - velocity.current.z) * ACCELERATION * delta

      // Update target rotation
      targetRotation.current = Math.atan2(inputX, inputZ)
    } else {
      // Apply friction
      velocity.current.x -= velocity.current.x * FRICTION * delta
      velocity.current.z -= velocity.current.z * FRICTION * delta
    }

    // Update position
    position.current.x += velocity.current.x * delta
    position.current.z += velocity.current.z * delta

    // Clamp to bounds
    const distFromCenter = Math.sqrt(position.current.x ** 2 + position.current.z ** 2)
    if (distFromCenter > BOUNDS) {
      const scale = BOUNDS / distFromCenter
      position.current.x *= scale
      position.current.z *= scale
    }

    // Character bob animation
    if (isMoving.current) {
      bobPhase.current += delta * 12
      position.current.y = 0.8 + Math.sin(bobPhase.current) * 0.08
    } else {
      position.current.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.03
    }

    // Update group position and rotation
    groupRef.current.position.set(position.current.x, position.current.y, position.current.z)

    // Smooth rotation
    const currentRotation = groupRef.current.rotation.y
    const rotationDiff = targetRotation.current - currentRotation
    const normalizedDiff = Math.atan2(Math.sin(rotationDiff), Math.cos(rotationDiff))
    groupRef.current.rotation.y += normalizedDiff * 10 * delta

    // Update camera to follow character
    const cameraOffset = new THREE.Vector3(0, 12, 16)
    const targetCameraPos = new THREE.Vector3(
      position.current.x + cameraOffset.x,
      cameraOffset.y,
      position.current.z + cameraOffset.z
    )
    camera.position.lerp(targetCameraPos, 2 * delta)
    camera.lookAt(position.current.x, 1, position.current.z)

    // Report position
    onPositionChange({ x: position.current.x, z: position.current.z })
  })

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#1E88E5" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, -0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#1E88E5" roughness={0.7} />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.4, 4, 8]} />
        <meshStandardMaterial color="#42A5F5" roughness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.35, 0.05, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#42A5F5" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color="#42A5F5" roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.5} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.7, -0.05]} castShadow>
        <sphereGeometry args={[0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.58, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#212121" roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.58, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#212121" roughness={0.3} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.1, -0.25]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.2]} />
        <meshStandardMaterial color="#FF7043" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.2, -0.25]}>
        <boxGeometry args={[0.25, 0.08, 0.15]} />
        <meshStandardMaterial color="#BF360C" roughness={0.8} />
      </mesh>

      {/* Player indicator ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.74, 0]}>
        <ringGeometry args={[0.55, 0.65, 24]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
