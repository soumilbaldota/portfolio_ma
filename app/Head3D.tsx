"use client";
import { useEffect, useRef } from 'react';

export function Head3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const faceMeshRef = useRef<any>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import Three.js
    let THREE: any;
    let GLTFLoader: any;
    let animationFrameId: number;

    const initThree = async () => {
      // Load Three.js
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      document.head.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      THREE = (window as any).THREE;

      // Load GLTFLoader
      const loaderScript = document.createElement('script');
      loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      document.head.appendChild(loaderScript);

      await new Promise((resolve) => {
        loaderScript.onload = resolve;
      });

      GLTFLoader = THREE.GLTFLoader;

      // Initialize scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, 1, 1, 20);
      camera.position.set(0, 0, 3);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // Transparent background
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(100, 100);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      containerRef.current!.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight1.position.set(-5, 0, -5);
      scene.add(fillLight1);

      const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight2.position.set(0, -5, 5);
      scene.add(fillLight2);

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        '/head.glb',
        (gltf: any) => {
          const faceMesh = gltf.scene;
          faceMeshRef.current = faceMesh;

          // Center the model
          const box = new THREE.Box3().setFromObject(faceMesh);
          const center = box.getCenter(new THREE.Vector3());
          faceMesh.position.sub(center);

          // Scale the model
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          faceMesh.scale.setScalar(scale);

          scene.add(faceMesh);
        },
        undefined,
        (error: any) => {
          console.error('Error loading model:', error);
        }
      );

      // Mouse tracking
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        
        // Get the head's position on screen
        const rect = containerRef.current.getBoundingClientRect();
        const headCenterX = rect.left + rect.width / 2;
        const headCenterY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to head center
        const deltaX = e.clientX - headCenterX;
        const deltaY = e.clientY - headCenterY;
        
        // Calculate distance from head center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Normalize to -1 to 1 range based on screen dimensions
        const normalizedX = deltaX / (window.innerWidth / 2);
        const normalizedY = deltaY / (window.innerHeight / 2);
        
        // Limit the rotation range
        const maxRotation = Math.PI * 0.3;
        targetRotationRef.current.y = Math.max(-maxRotation, Math.min(maxRotation, normalizedX * maxRotation));
        targetRotationRef.current.x = Math.max(-maxRotation, Math.min(maxRotation, normalizedY * maxRotation));
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth interpolation
        const lerp = (start: number, end: number, factor: number) => {
          return start + (end - start) * factor;
        };

        if (faceMeshRef.current) {
          rotationRef.current.x = lerp(rotationRef.current.x, targetRotationRef.current.x, 0.1);
          rotationRef.current.y = lerp(rotationRef.current.y, targetRotationRef.current.y, 0.1);

          faceMeshRef.current.rotation.x = rotationRef.current.x;
          faceMeshRef.current.rotation.y = rotationRef.current.y;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
      };
    };

    initThree();

    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-[100px] h-[100px] relative overflow-hidden"
      style={{ 
        pointerEvents: 'none' // Don't block clicks on settings button
      }}
    />
  );
}
