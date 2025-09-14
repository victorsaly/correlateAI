import React, { useEffect, useRef } from 'react';

interface SwirlBackgroundProps {
  className?: string;
}

const SwirlBackground: React.FC<SwirlBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation parameters
    let time = 0;
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      angle: number;
      speed: number;
      size: number;
      opacity: number;
      hue: number;
      vx: number;
      vy: number;
    }> = [];

    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.8,
        size: 1 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.6,
        hue: 200 + Math.random() * 80, // Blue to purple-pink range
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }

    const animate = () => {
      // Clear with a more transparent trail for smoother motion
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      particles.forEach((particle, index) => {
        // Mouse interaction - particles are attracted to mouse
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mouse.x, 2) + Math.pow(particle.y - mouse.y, 2)
        );
        
        if (mouseDistance < 150) {
          const force = (150 - mouseDistance) / 150;
          const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
          particle.vx += Math.cos(angle) * force * 0.02;
          particle.vy += Math.sin(angle) * force * 0.02;
        }

        // Flowing motion with sine waves
        const flowX = Math.sin(time + particle.baseX * 0.01) * 2;
        const flowY = Math.cos(time * 0.7 + particle.baseY * 0.01) * 1.5;
        
        // Update velocity with flow and some random drift
        particle.vx += (flowX - particle.vx) * 0.05;
        particle.vy += (flowY - particle.vy) * 0.05;
        
        // Add some randomness
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
        
        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Gentle drift back to base position
        particle.x += (particle.baseX - particle.x) * 0.002;
        particle.y += (particle.baseY - particle.y) * 0.002;
        
        // Boundary wrapping with smooth transition
        if (particle.x < -50) {
          particle.x = canvas.width + 50;
          particle.baseX = canvas.width + 50;
        }
        if (particle.x > canvas.width + 50) {
          particle.x = -50;
          particle.baseX = -50;
        }
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.baseY = canvas.height + 50;
        }
        if (particle.y > canvas.height + 50) {
          particle.y = -50;
          particle.baseY = -50;
        }

        // Animate particle properties with AI-style colors
        particle.opacity = 0.4 + Math.sin(time + index * 0.1) * 0.3;
        particle.size = 2.5 + Math.sin(time * 2 + index * 0.2) * 1.5;
        particle.hue = 180 + Math.sin(time * 0.5 + index * 0.3) * 80; // Cyan to purple range

        // Create dynamic gradient for each particle with AI colors
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 8
        );
        
        // Enhanced AI-style gradient with cyan-purple theme
        gradient.addColorStop(0, `hsla(${particle.hue}, 90%, 75%, ${particle.opacity * 0.9})`);
        gradient.addColorStop(0.3, `hsla(${particle.hue + 30}, 80%, 65%, ${particle.opacity * 0.7})`);
        gradient.addColorStop(0.7, `hsla(${particle.hue + 60}, 70%, 55%, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 45%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw flowing AI-neural network style connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex && index > otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              const opacity = (120 - distance) / 120 * 0.4;
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y, 
                otherParticle.x, otherParticle.y
              );
              
              // Neural network style connections with cyan-purple gradient
              gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${opacity})`);
              gradient.addColorStop(0.5, `hsla(${(particle.hue + otherParticle.hue) / 2}, 85%, 65%, ${opacity * 1.2})`);
              gradient.addColorStop(1, `hsla(${otherParticle.hue}, 80%, 70%, ${opacity})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1 + opacity * 2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      // Add flowing background waves with AI-style deep colors
      const waveGradient = ctx.createLinearGradient(
        0, 0, 
        canvas.width, canvas.height
      );
      
      const wave1 = 0.04 + Math.sin(time * 0.8) * 0.03;
      const wave2 = 0.03 + Math.cos(time * 1.2) * 0.025;
      const wave3 = 0.05 + Math.sin(time * 0.5) * 0.035;
      
      waveGradient.addColorStop(0, `hsla(200, 70%, 20%, ${wave1})`);   // Deep cyan
      waveGradient.addColorStop(0.25, `hsla(220, 80%, 25%, ${wave2})`); // Blue
      waveGradient.addColorStop(0.5, `hsla(260, 70%, 30%, ${wave2})`);  // Purple  
      waveGradient.addColorStop(0.75, `hsla(280, 60%, 25%, ${wave1})`); // Deep purple
      waveGradient.addColorStop(1, `hsla(190, 60%, 15%, ${wave3})`);    // Dark teal
      
      ctx.fillStyle = waveGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      style={{ 
        background: 'radial-gradient(ellipse at center, #0F172A 0%, #020617 50%, #000000 100%)',
        filter: 'contrast(1.3) brightness(1.2) saturate(1.1)'
      }}
    />
  );
};

export default SwirlBackground;