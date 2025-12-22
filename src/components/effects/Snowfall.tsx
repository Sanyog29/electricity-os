'use client';

import { useEffect, useRef } from 'react';

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
}

export function Snowfall() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const snowflakes: Snowflake[] = [];
        const maxSnowflakes = 100;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Initialize snowflakes
        const createSnowflake = (): Snowflake => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3,
        });

        for (let i = 0; i < maxSnowflakes; i++) {
            const snowflake = createSnowflake();
            snowflake.y = Math.random() * canvas.height; // Start at random positions
            snowflakes.push(snowflake);
        }

        const drawSnowflakes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const flake of snowflakes) {
                // Draw the snowflake
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();

                // Add a subtle glow
                const gradient = ctx.createRadialGradient(
                    flake.x, flake.y, 0,
                    flake.x, flake.y, flake.radius * 2
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind + Math.sin(flake.y * 0.01) * 0.5;

                // Reset snowflake if it goes off screen
                if (flake.y > canvas.height + 10) {
                    flake.y = -10;
                    flake.x = Math.random() * canvas.width;
                }

                // Wrap horizontally
                if (flake.x > canvas.width + 10) {
                    flake.x = -10;
                } else if (flake.x < -10) {
                    flake.x = canvas.width + 10;
                }
            }

            animationId = requestAnimationFrame(drawSnowflakes);
        };

        drawSnowflakes();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="snowfall-canvas"
                aria-hidden="true"
            />
            <style jsx>{`
                .snowfall-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                    pointer-events: none;
                }
            `}</style>
        </>
    );
}
