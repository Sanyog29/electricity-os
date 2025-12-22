'use client';

import { useEffect, useRef } from 'react';

export function AuroraBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Aurora colors
        const colors = [
            { r: 52, g: 114, b: 255, a: 0.3 },   // Electric blue
            { r: 16, g: 185, b: 129, a: 0.2 },   // Emerald
            { r: 139, g: 92, b: 246, a: 0.25 },  // Purple
            { r: 99, g: 102, b: 241, a: 0.2 },   // Indigo
        ];

        const drawAurora = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw multiple aurora waves
            for (let i = 0; i < colors.length; i++) {
                const color = colors[i];
                const yOffset = canvas.height * 0.3 + Math.sin(time * 0.0003 + i) * 100;
                const amplitude = 150 + Math.sin(time * 0.0005 + i * 2) * 50;

                ctx.beginPath();
                ctx.moveTo(0, canvas.height);

                for (let x = 0; x <= canvas.width; x += 5) {
                    const y = yOffset +
                        Math.sin(x * 0.003 + time * 0.001 + i) * amplitude +
                        Math.sin(x * 0.007 + time * 0.0008 + i * 1.5) * (amplitude * 0.5) +
                        Math.sin(x * 0.001 + time * 0.0005) * (amplitude * 0.3);
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();

                // Create gradient
                const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, canvas.height);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.5})`);
                gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Add some floating orbs
            for (let i = 0; i < 5; i++) {
                const x = (canvas.width * 0.2) + Math.sin(time * 0.0002 + i * 1.3) * (canvas.width * 0.3);
                const y = (canvas.height * 0.3) + Math.cos(time * 0.0003 + i * 0.7) * (canvas.height * 0.2);
                const radius = 100 + Math.sin(time * 0.001 + i) * 50;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                const colorIndex = i % colors.length;
                const c = colors[colorIndex];
                gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.15)`);
                gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.05)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            time += 16;
            animationId = requestAnimationFrame(drawAurora);
        };

        drawAurora();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="aurora-background"
                aria-hidden="true"
            />
            <style jsx>{`
                .aurora-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -10;
                    pointer-events: none;
                    opacity: 0.7;
                }
            `}</style>
        </>
    );
}
