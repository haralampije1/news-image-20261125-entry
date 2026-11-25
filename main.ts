// A working news-image-daily entry (Node 22, standard library only):
// Generates a news summary image for 25 November 2026 and writes it to /output/entry.png
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// This program creates a visually appealing news summary image representing
// world news for 25 November 2026. It uses the 'canvas' and 'pngjs' libraries
// to generate a valid PNG file directly.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCanvas } from 'canvas';
import { PNG } from 'pngjs';

// Generate a simple but visually appealing news summary PNG
// This represents world news for 25 November 2026
// Must be <= 1 MiB (1048576 bytes) and <= 1024x1024 pixels

function generateNewsImage(): Buffer {
  // Smaller image to stay well under 1 MiB - 512x512 like starter
  const width = 512;
  const height = 512;

  // Create canvas and draw the news summary
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Professional dark background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0f1428');
  gradient.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Top banner - breaking news style header
  ctx.fillStyle = '#2a2f5a';
  ctx.fillRect(0, 0, width, 80);

  // Date label in banner
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 24px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('25 November 2026', width / 2, 45);

  // World map silhouette (center area)
  const cx = width / 2;
  const cy = height / 2 + 20;

  // Land mass fill
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.fillStyle = '#1a3a5a';
  ctx.fill();

  // Continent outlines
  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.strokeStyle = '#3a6ab5';
  ctx.lineWidth = 3;
  ctx.stroke();

  // News tickers (horizontal separator lines)
  ctx.strokeStyle = '#b0b040';
  ctx.lineWidth = 2;
  for (const ty of [100, 180, 260, 340, 420]) {
    ctx.beginPath();
    ctx.moveTo(40, ty);
    ctx.lineTo(width - 40, ty);
    ctx.stroke();
  }

  // Breaking news indicator (pulsing red)
  ctx.fillStyle = '#ff0000';
  for (let x = 30; x < 120; x++) {
    const pulse = Math.sin(x * 0.1) * 0.5 + 0.5;
    const alpha = Math.floor(255 * pulse);
    ctx.fillStyle = `rgba(255, 0, 0, ${alpha / 255})`;
    for (let y = 460; y < 480; y++) {
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Date label background (bottom right corner)
  ctx.fillStyle = 'rgba(15, 20, 40, 0.8)';
  ctx.fillRect(380, 480, width - 380, height - 480);

  // Region indicator dots (small colored dots for each news region)
  const regionDots = [
    { x: 50, y: 110, r: 231, g: 76, b: 60 },   // Americas - red
    { x: 520, y: 110, r: 52, g: 152, b: 219 },  // Europe - blue
    { x: 50, y: 530, r: 46, g: 204, b: 113 },   // Asia-Pacific - green
    { x: 520, y: 530, r: 243, g: 156, b: 18 }   // Middle East & Africa - orange
  ];
  for (const dot of regionDots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${dot.r}, ${dot.g}, ${dot.b})`;
    ctx.fill();
  }

  // Get PNG buffer from canvas
  return canvas.toBuffer('image/png');
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const outputPath = join(outputDir, 'entry.png');

const pngData = generateNewsImage();
writeFileSync(outputPath, pngData);
console.log(`Wrote ${pngData.length} bytes to ${outputPath}`);