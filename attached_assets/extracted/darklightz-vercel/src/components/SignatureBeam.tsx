import { useRef, useMemo, Suspense, Component, ReactNode } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshReflectorMaterial } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ---------- WebGL Error Boundary — graceful fallback when GPU unavailable ----------

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    return this.state.error ? this.props.fallback : this.props.children
  }
}

// ---------- Cube split into two halves with clipping planes ----------

function CubeHalves() {
  const groupRef = useRef<THREE.Group>(null!)
  const topRef   = useRef<THREE.Mesh>(null!)
  const botRef   = useRef<THREE.Mesh>(null!)

  // Clipping planes: top half shows geometry where y > 0, bottom where y < 0
  const topClip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const botClip = useMemo(() => new THREE.Plane(new THREE.Vector3(0,  1, 0), 0), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Slow cinematic Y-axis rotation + subtle floating
    groupRef.current.rotation.y = 0.45 + Math.sin(t * 0.12) * 0.22
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.04
    groupRef.current.position.y = Math.sin(t * 0.35) * 0.07

    // Halves gently breathe apart and back
    const sep = Math.abs(Math.sin(t * 0.22)) * 0.13
    topRef.current.position.y =  sep
    botRef.current.position.y = -sep
  })

  const sharedMat = {
    roughness : 0.82,
    metalness : 0.22,
    envMapIntensity: 0.4,
  }

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      {/* Top half */}
      <mesh ref={topRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          {...sharedMat}
          color="#1d1d1d"
          clippingPlanes={[topClip]}
          clipShadows
        />
      </mesh>

      {/* Bottom half */}
      <mesh ref={botRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          {...sharedMat}
          color="#161616"
          clippingPlanes={[botClip]}
          clipShadows
        />
      </mesh>
    </group>
  )
}

// ---------- The diagonal light beam ----------

function Beam() {
  const coreRef = useRef<THREE.Mesh>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Subtle pulse so the beam feels alive
    const pulse = 0.85 + Math.sin(t * 1.8) * 0.15
    ;(coreRef.current.material as THREE.MeshBasicMaterial).opacity = pulse
    ;(haloRef.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.18
  })

  return (
    // Rotate 45° around Z so the beam slices diagonally top-right → bottom-left
    <group rotation={[0, 0, Math.PI / 4]} position={[0, 0.35, 0.62]}>
      {/* Thin bright core */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.004, 0.004, 16, 6]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </mesh>

      {/* Wide soft halo — bloom amplifies this into a convincing glow */}
      <mesh ref={haloRef}>
        <cylinderGeometry args={[0.055, 0.055, 16, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ---------- Reflective dark floor ----------

function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.38, 0]}
      receiveShadow
    >
      <planeGeometry args={[24, 24]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={35}
        roughness={1}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#030303"
        metalness={0.6}
        mirror={0}
      />
    </mesh>
  )
}

// ---------- WebGL availability check (runs once, synchronously) ----------

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

// ---------- CSS fallback shown when WebGL is unavailable ----------

function CSSFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Simulate the dark cube with CSS */}
      <div className="relative w-48 h-48 perspective-[600px]">
        <div
          className="absolute inset-0 bg-[#1a1a1a] border border-white/5"
          style={{ transform: "rotateY(20deg) rotateX(10deg)" }}
        />
        <div
          className="absolute inset-0 w-full h-[1px] top-1/2 bg-white origin-center"
          style={{
            transform: "rotate(-45deg) scaleX(3)",
            boxShadow: "0 0 20px 8px rgba(255,255,255,0.5)",
          }}
        />
      </div>
    </div>
  )
}

// ---------- Exported component — only this file changed ----------

export function SignatureBeam() {
  // Skip Canvas entirely in environments without WebGL (avoids Vite overlay noise)
  const webglAvailable = typeof window !== "undefined" && hasWebGL()

  return (
    <div
      className="w-full"
      style={{ height: "clamp(360px, 48vw, 540px)" }}
    >
      {!webglAvailable && <CSSFallback />}
      {webglAvailable && <WebGLErrorBoundary fallback={<CSSFallback />}>
        <Canvas
          camera={{ position: [0, 1.6, 5.2], fov: 40 }}
          gl={{ localClippingEnabled: true, antialias: true }}
          shadows
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            // Confirm WebGL is working; if context lost immediately, the
            // error boundary above will catch the thrown error.
            gl.setClearColor(0x000000, 1)
          }}
        >
          {/* Pure black bg matching brand */}
          <color attach="background" args={["#000000"]} />

          {/* Very dim ambient — faces stay dark like the reference */}
          <ambientLight intensity={0.04} />

          {/* Key light from top-right — lights the top/right faces of the cube */}
          <spotLight
            position={[6, 9, 5]}
            angle={0.18}
            penumbra={1}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#ffffff"
          />

          {/* Subtle fill from the left so the left face isn't pure black */}
          <pointLight position={[-4, 2, 3]} intensity={0.25} color="#888888" />

          <Suspense fallback={null}>
            <CubeHalves />
            <Beam />
            <Floor />

            <EffectComposer>
              <Bloom
                luminanceThreshold={0.35}
                luminanceSmoothing={0.85}
                intensity={2.8}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>}
    </div>
  )
}
