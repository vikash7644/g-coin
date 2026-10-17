'use client';

import { useEffect, useRef } from 'react';

export function CoinCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 150);
    grad.addColorStop(0, '#fff4aa');
    grad.addColorStop(0.35, '#f7d76f');
    grad.addColorStop(0.7, '#d9a441');
    grad.addColorStop(1, '#8b5e2b');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(width / 2 - 30, height / 2 - 30, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4b2c08';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', width / 2, height / 2 + 8);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = 'rgba(75, 44, 8, 0.85)';
    ctx.fillText('BUILD TO MINT', width / 2, height - 28);
  }, []);

  return <canvas ref={canvasRef} width={340} height={340} className="rounded-full shadow-glow" />;
}
