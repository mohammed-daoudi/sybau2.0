'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, RotateCw, Move3D } from 'lucide-react';
import * as THREE from 'three';
import type { Product } from '@/lib/types';

interface ProductViewer3DProps {
  product: Product;
  selectedVariant: number;
}

// Enhanced 3D Model Component with GLTF loading
function Model3D({ url, autoRotate = true, ...props }: { url: string; autoRotate?: boolean; [key: string]: any }) {
  const meshRef = useRef<THREE.Group>();
  const [modelError, setModelError] = useState(false);
  
  // Try to load actual GLTF model, fallback to placeholder
  let scene;
  try {
    if (url && url.endsWith('.glb') || url.endsWith('.gltf')) {
      // Uncomment when actual GLTF models are available
      // scene = useGLTF(url).scene;
    }
  } catch (error) {
    console.warn('Failed to load GLTF model:', error);
    setModelError(true);
  }
  
  // Animate the model rotation when autoRotate is enabled
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Enhanced placeholder model with better styling
  return (
    <group ref={meshRef} {...props}>
      {scene ? (
        <primitive object={scene} />
      ) : (
        // Enhanced placeholder with multiple elements to simulate product complexity
        <>
          {/* Main body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 1.2, 2.2]} />
            <meshStandardMaterial 
              color="#ff2b4a" 
              metalness={0.9} 
              roughness={0.1}
              emissive="#8b0000"
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Accent elements */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.8, 0.2, 1.8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.1} 
              roughness={0.8}
            />
          </mesh>
          
          {/* Logo placeholder */}
          <mesh position={[0, 0.05, 1.1]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial 
              color="#000000" 
              metalness={0.1} 
              roughness={0.9}
              emissive="#ff2b4a"
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {/* Shadow catcher */}
          <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-auraRed border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Html>
  );
}

// Camera animation component
function CameraController({ target, autoRotate }: { target: THREE.Vector3; autoRotate: boolean }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (autoRotate) {
      const time = state.clock.elapsedTime;
      camera.position.x = Math.cos(time * 0.2) * 8;
      camera.position.z = Math.sin(time * 0.2) * 8;
      camera.lookAt(target);
    }
  });
  
  return null;
}

export function ProductViewer3D({ product, selectedVariant }: ProductViewer3DProps) {
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const controlsRef = useRef<any>();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setZoom(1);
    }
  };
  
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotate;
    }
  };
  
  const zoomIn = () => {
    if (controlsRef.current && zoom < 3) {
      setZoom(prev => Math.min(prev + 0.2, 3));
      controlsRef.current.dollyIn(0.9);
      controlsRef.current.update();
    }
  };
  
  const zoomOut = () => {
    if (controlsRef.current && zoom > 0.3) {
      setZoom(prev => Math.max(prev - 0.2, 0.3));
      controlsRef.current.dollyOut(0.9);
      controlsRef.current.update();
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && canvasRef.current) {
      canvasRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const modelUrl = product.variants[selectedVariant]?.modelUrl || product.models?.[0] || '/models/default-cap.glb';
  const target = new THREE.Vector3(0, 0, 0);

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full min-h-[400px] lg:min-h-[600px] ${
        isFullscreen ? 'fixed inset-0 z-50 bg-brand-black' : ''
      }`}
    >
      {/* 3D Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-full h-full glass-effect rounded-2xl overflow-hidden relative ${
          isFullscreen ? 'rounded-none' : ''
        }`}
      >
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          className="w-full h-full"
          onCreated={({ gl, scene }) => {
            gl.setClearColor('#1b0000', 0.1);
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.fog = new THREE.Fog('#1b0000', 10, 50);
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            {/* Enhanced Lighting Setup */}
            <Environment preset="studio" />
            <ambientLight intensity={0.4} />
            
            {/* Key light */}
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              color="#ff2b4a"
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            
            {/* Fill light */}
            <pointLight position={[-5, 5, 5]} intensity={0.6} color="#8b0000" />
            
            {/* Rim light */}
            <pointLight position={[0, -5, -5]} intensity={0.8} color="#ffffff" />
            
            {/* 3D Model with enhanced features */}
            <Model3D url={modelUrl} autoRotate={false} castShadow receiveShadow />
            
            {/* Camera Controller */}
            <CameraController target={target} autoRotate={autoRotate} />
            
            {/* Enhanced Controls */}
            <OrbitControls
              ref={controlsRef}
              target={target}
              enabled={controlsEnabled}
              enablePan={isMobile ? false : true}
              enableDamping={true}
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={12}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
          </Suspense>
        </Canvas>

        {/* Enhanced Floating UI Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetCamera}
            className="p-3 glass-effect rounded-lg text-white hover:text-brand-auraRed transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAutoRotate}
            className={`p-3 glass-effect rounded-lg transition-colors ${
              autoRotate ? 'text-brand-auraRed bg-brand-auraRed/20' : 'text-white hover:text-brand-auraRed'
            }`}
            title="Toggle auto rotate"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={zoomIn}
            className="p-3 glass-effect rounded-lg text-white hover:text-brand-auraRed transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={zoomOut}
            className="p-3 glass-effect rounded-lg text-white hover:text-brand-auraRed transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-3 glass-effect rounded-lg text-white hover:text-brand-auraRed transition-colors"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Enhanced Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 glass-effect px-4 py-3 rounded-lg max-w-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <Move3D className="w-4 h-4 text-brand-auraRed" />
            <span className="text-white font-medium text-sm">3D Controls</span>
          </div>
          <div className="text-white/70 text-xs space-y-1">
            {isMobile ? (
              <>
                <p><span className="text-brand-auraRed font-semibold">Touch & drag</span> to rotate</p>
                <p><span className="text-brand-auraRed font-semibold">Pinch</span> to zoom</p>
                <p><span className="text-brand-auraRed font-semibold">Tap buttons</span> for controls</p>
              </>
            ) : (
              <>
                <p><span className="text-brand-auraRed font-semibold">Click & drag</span> to rotate</p>
                <p><span className="text-brand-auraRed font-semibold">Scroll</span> to zoom</p>
                <p><span className="text-brand-auraRed font-semibold">Right-click & drag</span> to pan</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Enhanced Variant indicator with zoom level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 left-4 glass-effect px-4 py-3 rounded-lg"
        >
          {product.variants && product.variants.length > 0 && (
            <p className="text-white text-sm mb-1">
              <span className="text-white/70">Viewing:</span>{' '}
              <span className="text-brand-auraRed font-semibold">
                {product.variants[selectedVariant]?.value || 'Default'}
              </span>
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            {autoRotate && (
              <>
                <span>•</span>
                <span className="text-brand-auraRed">Auto-rotating</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-auraRed/10 to-brand-crimson/10 pointer-events-none" />
      </motion.div>

      {/* Enhanced 3D Model info */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 text-center space-y-3"
          >
            {/* Feature badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="px-3 py-1 bg-brand-auraRed/20 text-brand-auraRed text-xs font-medium rounded-full border border-brand-auraRed/30">
                ✨ Interactive 3D
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                📱 Mobile Ready
              </div>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                🎮 Advanced Controls
              </div>
            </div>
            
            {/* Development info */}
            <div className="text-white/40 text-xs space-y-1">
              <p>
                💡 <strong className="text-white/60">Enhanced 3D Viewer:</strong> Real-time shadows, advanced lighting & mobile support
              </p>
              <p className="font-mono text-brand-auraRed/60">
                Model: {modelUrl.split('/').pop() || 'enhanced-placeholder'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}