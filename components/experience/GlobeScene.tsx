"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { locations } from "@/data/locations";

type Progress = React.RefObject<number>;

function positionOnGlobe(lat: number, lon: number, radius = 2.3) {
  const a = THREE.MathUtils.degToRad(lat);
  const b = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(a) * Math.sin(b),
    radius * Math.sin(a),
    radius * Math.cos(a) * Math.cos(b)
  );
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uFade;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 tex = texture2D(uMap, vec2(fract(vUv.x + 0.25), vUv.y)).rgb;
    float land = smoothstep(-0.016, 0.11, tex.r - tex.b * 0.48 + tex.g * 0.09);
    float light = clamp(dot(normalize(vNormal), normalize(vec3(-0.32, 0.42, 0.84))), 0.0, 1.0);
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 3.0);
    vec3 ocean = vec3(0.018, 0.036, 0.055);
    float detail = dot(tex, vec3(0.30, 0.59, 0.11));
    vec3 continent = vec3(0.065, 0.077, 0.088) + detail * vec3(0.14, 0.14, 0.13);
    vec3 color = mix(ocean, continent, land);
    color *= 0.20 + light * 1.10;
    color += vec3(0.28, 0.33, 0.40) * rim * 0.46;
    color += vec3(0.23, 0.18, 0.10) * land * pow(light, 4.0) * 0.12;
    float scan = pow(max(0.0, 1.0 - abs(vPosition.y / 2.3 - (0.75 - uProgress * 1.5))), 28.0);
    color += vec3(0.14, 0.16, 0.18) * scan * land * (1.0 - uProgress * 0.55);
    gl_FragColor = vec4(color, uReveal * uFade);
  }
`;

type DragState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  yaw: number;
  pitch: number;
  velocityY: number;
  velocityX: number;
};

function Globe({ progress, presence = false, outro = false, reduced = false, compact = false, selected = 0 }: {
  progress?: Progress; presence?: boolean; outro?: boolean; reduced?: boolean; compact?: boolean; selected?: number;
}) {
  const texture = useTexture("/assets/earth-atmos.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.offset.x = 0.25;
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const atmosphere = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const intro = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef<DragState>({ pointerId: null, startX: 0, startY: 0, lastX: 0, lastY: 0, yaw: 0, pitch: 0, velocityY: 0, velocityX: 0 });
  const spin = useRef(0);
  const zoomStep = useRef(0);
  const lastTouchTap = useRef({ time: 0, x: 0, y: 0 });
  const lastTouchZoom = useRef(-Infinity);
  const routePulses = useRef<THREE.Mesh[]>([]);
  useEffect(() => () => document.body.classList.remove("globe-dragging"), []);
  const arcs = useMemo(() => [
    [0, 1], [1, 2], [2, 6], [2, 7], [1, 3], [3, 4], [3, 5],
  ].map(([a, b]) => {
    const start = positionOnGlobe(locations[a].lat, locations[a].lon);
    const end = positionOnGlobe(locations[b].lat, locations[b].lon);
    return Array.from({ length: 48 }, (_, i) => {
      const t = i / 47;
      const v = start.clone().lerp(end, t).normalize();
      return v.multiplyScalar(2.315 + Math.sin(Math.PI * t) * 0.42);
    });
  }), []);

  const cycleZoom = () => {
    zoomStep.current = (zoomStep.current + 1) % 4;
  };

  useFrame((state, delta) => {
    if (!group.current || !material.current) return;
    const p = reduced ? 0 : progress?.current ?? 0;
    group.current.visible = presence || p < 0.61;
    intro.current = Math.min(1, intro.current + delta * (reduced ? 5 : 0.62));
    const disappear = presence ? 1 : 1 - THREE.MathUtils.smoothstep(p, 0.37, 0.55);
    material.current.uniforms.uReveal.value = THREE.MathUtils.lerp(
      material.current.uniforms.uReveal.value, intro.current, 0.07
    );
    material.current.uniforms.uFade.value = disappear;
    material.current.uniforms.uProgress.value = presence ? 0.45 : p;
    const targetScale = presence ? (outro ? 1.15 - p * 0.42 : 1) : 1 + THREE.MathUtils.smoothstep(p, 0.19, 0.43) * 0.62;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 2.8, delta));
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, presence ? (outro ? 1.15 : 0) : (compact ? 0 : 1.55) - THREE.MathUtils.smoothstep(p, 0.29, 0.54) * (compact ? 3.3 : 6.35), 2.5, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, presence ? 0 : -THREE.MathUtils.smoothstep(p, 0.36, 0.54) * 2, 2.2, delta);
    const interaction = drag.current;
    if (!reduced) spin.current += Math.min(delta, 0.05) * 0.075;
    if (interaction.pointerId === null && !reduced) {
      const friction = Math.exp(-4.8 * delta);
      interaction.yaw += interaction.velocityY * delta;
      interaction.pitch = THREE.MathUtils.clamp(interaction.pitch + interaction.velocityX * delta, -1.1, 1.1);
      interaction.velocityY *= friction;
      interaction.velocityX *= friction;
    }
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (presence ? -0.64 + selected * 0.27 : -0.42 + p * 1.7) + spin.current + interaction.yaw + (reduced || compact || interaction.pointerId !== null ? 0 : pointer.current.x * 0.025),
      interaction.pointerId === null ? 3.5 : 14, delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, (presence ? 0.07 : -0.04) + interaction.pitch + (interaction.pointerId === null && !compact ? pointer.current.y * 0.025 : 0), interaction.pointerId === null ? 3.5 : 14, delta);
    routePulses.current.forEach((pulse, i) => {
      const route = arcs[i];
      if (!pulse || !route) return;
      const phase = (state.clock.elapsedTime * (0.11 + i * 0.008) + i * 0.17) % 1;
      const position = phase * (route.length - 1);
      pulse.position.copy(route[Math.floor(position)]).lerp(route[Math.min(route.length - 1, Math.ceil(position))], position % 1);
      (pulse.material as THREE.MeshBasicMaterial).opacity = intro.current * disappear * (presence ? 0.75 : THREE.MathUtils.smoothstep(p, 0.08, 0.19) * (1 - THREE.MathUtils.smoothstep(p, 0.36, 0.50))) * Math.sin(Math.PI * phase);
    });
    if (atmosphere.current) atmosphere.current.opacity = 0.10 * intro.current * disappear;
    if (glow.current) glow.current.opacity = 0.05 * intro.current * disappear;
    if (outro) {
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 6.7 + p * 3.1, 1.6, delta);
      state.camera.lookAt(0.7, 0, 0);
    } else if (!presence) {
      const camera = state.camera;
      const approach = THREE.MathUtils.smoothstep(p, 0.17, 0.50);
      const manualZoom = zoomStep.current * (compact ? 0.45 : 0.85) * (1 - THREE.MathUtils.smoothstep(p, 0.12, 0.36));
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 8.8 - approach * 5.0 + THREE.MathUtils.smoothstep(p, 0.61, 1) * 1.1 - manualZoom, 2.2, delta);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, approach * 0.75 + THREE.MathUtils.smoothstep(p, 0.51, 0.8) * 1.35, 2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, THREE.MathUtils.smoothstep(p, 0.42, 0.75) * -0.35, 2, delta);
      camera.lookAt(camera.position.x * 0.25, 0, -1.4);
    } else {
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 7.6 - zoomStep.current * (compact ? 0.4 : 0.65), 2.2, delta);
    }
  });

  return (
    <group
      ref={group}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        pointer.current.x = event.pointer.x;
        pointer.current.y = event.pointer.y;
        const interaction = drag.current;
        if (interaction.pointerId !== event.pointerId) return;
        const dx = event.clientX - interaction.lastX;
        const dy = event.clientY - interaction.lastY;
        interaction.yaw += dx * 0.009;
        interaction.pitch = THREE.MathUtils.clamp(interaction.pitch + dy * 0.006, -1.1, 1.1);
        interaction.velocityY = reduced ? 0 : THREE.MathUtils.clamp(dx * 0.3, -3.5, 3.5);
        interaction.velocityX = reduced ? 0 : THREE.MathUtils.clamp(dy * 0.2, -2.2, 2.2);
        interaction.lastX = event.clientX;
        interaction.lastY = event.clientY;
        event.stopPropagation();
      }}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        if (drag.current.pointerId !== null || (!presence && (progress?.current ?? 0) > 0.39)) return;
        event.stopPropagation();
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        drag.current.pointerId = event.pointerId;
        drag.current.startX = event.clientX;
        drag.current.startY = event.clientY;
        drag.current.lastX = event.clientX;
        drag.current.lastY = event.clientY;
        drag.current.velocityY = 0;
        drag.current.velocityX = 0;
        document.body.classList.add("globe-dragging");
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        if (drag.current.pointerId !== event.pointerId) return;
        event.stopPropagation();
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        drag.current.pointerId = null;
        document.body.classList.remove("globe-dragging");
        if (event.nativeEvent.pointerType === "touch" && Math.hypot(event.clientX - drag.current.startX, event.clientY - drag.current.startY) < 12) {
          const now = performance.now();
          const previous = lastTouchTap.current;
          if (now - previous.time < 320 && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 32) {
            cycleZoom();
            lastTouchZoom.current = now;
            previous.time = 0;
          } else {
            lastTouchTap.current = { time: now, x: event.clientX, y: event.clientY };
          }
        }
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (performance.now() - lastTouchZoom.current > 400) cycleZoom();
      }}
      onPointerCancel={() => {
        drag.current.pointerId = null;
        document.body.classList.remove("globe-dragging");
      }}
    >
      <mesh>
        <sphereGeometry args={[2.3, reduced || compact ? 40 : 64, reduced || compact ? 32 : 48]} />
        <shaderMaterial ref={material} uniforms={{
          uMap: { value: texture }, uReveal: { value: 0 }, uFade: { value: 1 }, uProgress: { value: 0 },
        }} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite />
      </mesh>
      <mesh scale={1.029}>
        <sphereGeometry args={[2.3, 48, 40]} />
        <meshBasicMaterial ref={atmosphere} color="#7190ae" transparent opacity={0.07} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={1.09}>
        <sphereGeometry args={[2.3, 36, 28]} />
        <meshBasicMaterial ref={glow} color="#7d8ba5" transparent opacity={0.04} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {locations.slice(0, reduced || compact ? 5 : 8).map((city, i) => {
        const pos = positionOnGlobe(city.lat, city.lon, 2.34);
        return (
          <group key={city.name} position={pos}>
            <mesh>
              <sphereGeometry args={[i === selected && presence ? 0.046 : 0.025, 10, 10]} />
              <meshBasicMaterial color={i === selected && presence ? "#e8d5a1" : "#d8b96f"} transparent opacity={0.95} />
            </mesh>
            <mesh scale={3.3}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#cbb57e" transparent opacity={0.1} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {!reduced && arcs.slice(0, compact ? 4 : 7).map((points, i) => (
        <Line key={i} points={points} color={i % 3 ? "#8c9ead" : "#b6a06a"} lineWidth={0.65} transparent opacity={0.28} depthWrite={false} />
      ))}
      {!reduced && arcs.slice(0, compact ? 4 : 7).map((_, i) => (
        <mesh key={`pulse-${i}`} ref={(node) => { if (node) routePulses.current[i] = node; }}>
          <sphereGeometry args={[compact ? 0.022 : 0.016, 8, 8]} />
          <meshBasicMaterial color={i % 3 ? "#bac9d5" : "#e4c98e"} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Network({ progress, reduced, compact }: { progress: Progress; reduced: boolean; compact: boolean }) {
  const points = useRef<THREE.Points>(null);
  const links = useRef<THREE.LineSegments>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const count = compact ? 26 : reduced ? 42 : 74;
  const original = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = i * 2.399963;
    const r = 0.8 + Math.sqrt(i / count) * 4.3;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.65, -1.5 + Math.sin(i * 14.73) * 2.8);
  }), [count]);
  const pointPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const linkPositions = useMemo(() => new Float32Array((count - 1) * 6), [count]);

  useFrame((_, delta) => {
    if (!points.current || !links.current) return;
    const p = progress.current;
    const reveal = THREE.MathUtils.smoothstep(p, 0.39, 0.54) * (1 - THREE.MathUtils.smoothstep(p, 0.9, 1));
    const clear = THREE.MathUtils.smoothstep(p, 0.64, 0.85);
    const arrival = THREE.MathUtils.smoothstep(p, 0.43, 0.62) * (1 - clear);
    for (let i = 0; i < count; i++) {
      const base = original[i];
      const x = (i / (count - 1) - 0.5) * 11;
      pointPositions[i * 3] = THREE.MathUtils.lerp(base.x * (1 + arrival * 0.3), x, clear);
      pointPositions[i * 3 + 1] = THREE.MathUtils.lerp(base.y * (1 + arrival * 0.3), 0, clear);
      pointPositions[i * 3 + 2] = THREE.MathUtils.lerp(base.z + arrival * Math.sin(i * 4.9) * 1.1, -1.7, clear);
    }
    // Refresh links after all point positions have moved.
    for (let i = 0; i < count - 1; i++) {
      const next = clear > 0.55 ? i + 1 : (i * 7 + 17) % count;
      linkPositions.set(pointPositions.subarray(i * 3, i * 3 + 3), i * 6);
      linkPositions.set(pointPositions.subarray(next * 3, next * 3 + 3), i * 6 + 3);
    }
    const pointAttribute = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const linkAttribute = links.current.geometry.attributes.position as THREE.BufferAttribute;
    pointAttribute.needsUpdate = true;
    linkAttribute.needsUpdate = true;
    (points.current.material as THREE.PointsMaterial).opacity = reveal * (0.65 + clear * 0.35);
    (links.current.material as THREE.LineBasicMaterial).opacity = reveal * (compact || reduced ? 0.09 + clear * 0.32 : 0.11 + clear * 0.43);
    if (pulse.current) {
      pulse.current.position.x = THREE.MathUtils.lerp(pulse.current.position.x, -5.4 + ((p * 4.7) % 1) * 10.8, Math.min(1, delta * 4));
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = reveal * clear * 0.7;
    }
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[pointPositions, 3]} /></bufferGeometry>
        <pointsMaterial color="#c9b992" size={reduced ? 0.045 : 0.035} sizeAttenuation transparent opacity={0} depthWrite={false} />
      </points>
      <lineSegments ref={links}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[linkPositions, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#90a6c0" transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <mesh ref={pulse} position={[-5, 0, -1.6]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#e8d5a1" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function HeroWorld({ progress, reduced, compact }: { progress: Progress; reduced: boolean; compact: boolean }) {
  return (
    <>
      <Globe progress={progress} reduced={reduced} compact={compact} />
      {!reduced && <Network progress={progress} reduced={reduced} compact={compact} />}
    </>
  );
}

export function HeroCanvas({ progress, reduced, compact }: { progress: Progress; reduced: boolean; compact: boolean }) {
  return (
    <Canvas aria-hidden="true" className="hero-canvas" dpr={reduced || compact ? [1, 1.2] : [1, 1.65]}
      camera={{ position: [0, 0, 8.8], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
      <Suspense fallback={null}><HeroWorld progress={progress} reduced={reduced} compact={compact} /></Suspense>
    </Canvas>
  );
}

export function PresenceCanvas({ selected, reduced, compact }: { selected: number; reduced: boolean; compact: boolean }) {
  return (
    <Canvas aria-hidden="true" className="presence-canvas" dpr={reduced || compact ? [1, 1.2] : [1, 1.5]}
      camera={{ position: [0, 0, 7.6], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <Suspense fallback={null}><Globe presence selected={selected} reduced={reduced} compact={compact} /></Suspense>
    </Canvas>
  );
}

export function ClosingCanvas({ progress, reduced, compact }: { progress: Progress; reduced: boolean; compact: boolean }) {
  return (
    <Canvas aria-hidden="true" className="closing-canvas" dpr={reduced || compact ? [1, 1.2] : [1, 1.5]}
      camera={{ position: [0, 0, 6.7], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <Suspense fallback={null}><Globe presence outro progress={progress} selected={3} reduced={reduced} compact={compact} /></Suspense>
    </Canvas>
  );
}
