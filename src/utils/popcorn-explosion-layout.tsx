"use client";

import React, { type CSSProperties, useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  lifetime: number; // in ms.
  age: number; // in ms.
  scale: number;
  opacity: number;
}

interface PopcornExplosionLayoutProps {
  children: React.ReactNode;
}

// Gravity (pixels per second squared)
const GRAVITY = 800;

export default function PopcornExplosionLayout({
  children,
}: PopcornExplosionLayoutProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Function to create an explosion at a given x,y (client coordinates)
  const createExplosion = (x: number, y: number) => {
    const numParticles = 30;
    const newParticles: Particle[] = [];

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 200 + Math.random() * 300; // pixels/second
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const lifetime = 1500 + Math.random() * 500; // ms
      const particle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        vx,
        vy,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 360, // degrees/second
        lifetime,
        age: 0,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 1,
      };
      newParticles.push(particle);
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Click handler: create explosion at click coordinates.
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    createExplosion(clientX, clientY);
  };

  // Animation loop: update particle positions, apply gravity and fade-out.
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000; // dt in seconds
      lastTime = time;

      setParticles((prevParticles) =>
        prevParticles
          .map((p) => {
            const newAge = p.age + dt * 1000;
            const progress = newAge / p.lifetime;

            // Update position using velocity. Apply gravity to vertical velocity.
            const newX = p.x + p.vx * dt;
            const newVy = p.vy + GRAVITY * dt;
            const newY = p.y + newVy * dt;

            // Update rotation.
            const newRotation = p.rotation + p.rotationSpeed * dt;

            // Fade out linearly toward the end of lifetime.
            const newOpacity = Math.max(1 - progress, 0);

            return {
              ...p,
              x: newX,
              y: newY,
              vy: newVy,
              rotation: newRotation,
              age: newAge,
              opacity: newOpacity,
            };
          })
          .filter((p) => p.age < p.lifetime),
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div onClick={handleClick} style={{ position: "relative" }}>
      {/* Particle layer: full screen overlay with pointer events none */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {particles.map((p) => {
          // Adjust positioning so the image is centered on (p.x, p.y)
          const style: CSSProperties = {
            position: "absolute",
            left: p.x - 16 * p.scale,
            top: p.y - 16 * p.scale,
            width: 32 * p.scale,
            height: 32 * p.scale,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            pointerEvents: "none",
          };
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={
                "https://t4.ftcdn.net/jpg/05/38/38/49/360_F_538384940_FOTHmJDGjaGesuuzqTN3PpIFWk08r96A.png"
              }
              //https://preview.redd.it/6v2n5xa3xgk11.png?auto=webp&s=38993ac24ac9e92958e09f6141ec746dc71ef8b2
              //src="https://em-content.zobj.net/thumbs/120/apple/325/popcorn_1f37f.png"
              alt="Popcorn"
              style={style}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
