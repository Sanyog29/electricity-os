'use client';

import { useEffect, useRef, useState } from 'react';

export function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const mousePosition = useRef({ x: -100, y: -100, initialized: false });

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Check for touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }

        setIsMounted(true);

        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        if (!cursor || !cursorDot) return;

        let cursorX = -100;
        let cursorY = -100;
        let dotX = -100;
        let dotY = -100;
        let animationId: number;

        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = { x: e.clientX, y: e.clientY, initialized: true };
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            if (mousePosition.current.initialized) {
                setIsVisible(true);
            }
        };

        // Check for interactive elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'SELECT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.classList.contains('card-interactive');

            setIsHovering(!!isInteractive);
        };

        const animate = () => {
            const { x: mouseX, y: mouseY, initialized } = mousePosition.current;

            if (!initialized) {
                animationId = requestAnimationFrame(animate);
                return;
            }

            // Smooth follow for outer ring
            const easing = 0.12;
            cursorX += (mouseX - cursorX) * easing;
            cursorY += (mouseY - cursorY) * easing;

            // Faster follow for inner dot
            const dotEasing = 0.25;
            dotX += (mouseX - dotX) * dotEasing;
            dotY += (mouseY - dotY) * dotEasing;

            if (cursor && cursorDot) {
                cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
                cursorDot.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleElementHover);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        animationId = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleElementHover);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(animationId);
        };
    }, [isVisible]);

    // Don't render on SSR or touch devices
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div
                ref={cursorRef}
                className={`magnetic-cursor ${isVisible ? 'visible' : ''} ${isHovering ? 'hovering' : ''}`}
            />
            <div
                ref={cursorDotRef}
                className={`magnetic-cursor-dot ${isVisible ? 'visible' : ''} ${isHovering ? 'hovering' : ''}`}
            />
            <style jsx>{`
                .magnetic-cursor {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 40px;
                    height: 40px;
                    border: 1.5px solid rgba(52, 114, 255, 0.6);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0;
                    will-change: transform;
                    transition: opacity 0.3s ease, 
                                width 0.2s ease, height 0.2s ease, 
                                border-color 0.2s ease, background 0.2s ease;
                    backdrop-filter: blur(1px);
                }

                .magnetic-cursor.visible {
                    opacity: 1;
                }

                .magnetic-cursor.hovering {
                    width: 56px;
                    height: 56px;
                    border-color: rgba(52, 114, 255, 0.9);
                    background: rgba(52, 114, 255, 0.08);
                    margin-left: -8px;
                    margin-top: -8px;
                }

                .magnetic-cursor-dot {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, rgba(52, 114, 255, 1), rgba(139, 92, 246, 1));
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    opacity: 0;
                    will-change: transform;
                    transition: opacity 0.3s ease,
                                width 0.2s ease, height 0.2s ease, background 0.2s ease;
                    box-shadow: 0 0 10px rgba(52, 114, 255, 0.5);
                }

                .magnetic-cursor-dot.visible {
                    opacity: 1;
                }

                .magnetic-cursor-dot.hovering {
                    width: 10px;
                    height: 10px;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 1), rgba(52, 211, 153, 1));
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
                    margin-left: -1px;
                    margin-top: -1px;
                }

                @media (max-width: 768px) {
                    .magnetic-cursor,
                    .magnetic-cursor-dot {
                        display: none !important;
                    }
                }

                @media (pointer: coarse) {
                    .magnetic-cursor,
                    .magnetic-cursor-dot {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
