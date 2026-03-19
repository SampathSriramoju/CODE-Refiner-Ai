import React, { useEffect, useState } from "react";

export default function ParticleBackground() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          size: Math.random() * 4 + 2,
          left: Math.random() * 100,
          animationDelay: Math.random() * 15,
          animationDuration: Math.random() * 10 + 15,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[rgba(var(--primary),0.75)] particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px rgba(var(--primary), 0.35)`
          }}
        />
      ))}
      
      {/* Additional floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed-2" />
      
      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--primary),0.18)] via-transparent to-[rgba(var(--accent),0.12)] animate-gradient-shift" />
      </div>
    </div>
  );
}
