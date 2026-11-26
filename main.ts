// News image generator for 25 November 2026
// Generates a professional news summary graphic as PNG to /output/entry.png

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Simple PNG encoder (pure TypeScript, no dependencies)
class PNGEncoder {
  private width: number;
  private height: number;
  private data: Uint8Array; // RGBA

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
  }

  setPixel(x: number, y: number, r: number, g: number, b: number, a: number = 255) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (y * this.width + x) * 4;
    this.data[idx] = r;
    this.data[idx + 1] = g;
    this.data[idx + 2] = b;
    this.data[idx + 3] = a;
  }

  fillRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number = 255) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.setPixel(x + dx, y + dy, r, g, b, a);
      }
    }
  }

  drawText(x: number, y: number, text: string, fontSize: number, color: [number, number, number], maxWidth?: number) {
    // Simple bitmap font rendering (5x7 pixels per char, scaled)
    const scale = Math.max(1, Math.round(fontSize / 7));
    const charWidth = 5 * scale;
    const charHeight = 7 * scale;

    // 5x7 font bitmap for basic ASCII
    const font: Record<string, number[][]> = {
      '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
      '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
      '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
      '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
      '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
      '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
      '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
      '7': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,0,0]],
      '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
      '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
      'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
      'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
      'C': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
      'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
      'E': [[1,1,1],[1,0,0],[1,1,1],[1,0,0],[1,1,1]],
      'F': [[1,1,1],[1,0,0],[1,1,1],[1,0,0],[1,0,0]],
      'G': [[1,1,1],[1,0,0],[1,0,1],[1,0,1],[1,1,1]],
      'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
      'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
      'J': [[1,1,1],[0,0,1],[0,0,1],[1,0,1],[1,1,1]],
      'K': [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
      'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
      'M': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
      'N': [[1,0,1],[1,1,1],[1,1,1],[1,1,1],[1,0,1]],
      'O': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
      'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
      'Q': [[1,1,1],[1,0,1],[1,0,1],[1,1,0],[0,0,1]],
      'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
      'S': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
      'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
      'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
      'V': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
      'W': [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
      'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
      'Y': [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
      'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
      'a': [[0,0,0],[0,1,1],[1,0,1],[1,0,1],[0,1,1]],
      'b': [[1,0,0],[1,0,0],[1,1,0],[1,0,1],[1,1,0]],
      'c': [[0,0,0],[0,0,0],[0,1,1],[1,0,0],[0,1,1]],
      'd': [[0,0,1],[0,0,1],[0,1,1],[1,0,1],[0,1,1]],
      'e': [[0,0,0],[0,0,0],[1,1,1],[1,0,1],[1,1,1]],
      'f': [[0,1,1],[1,0,0],[1,1,1],[1,0,0],[1,0,0]],
      'g': [[0,0,0],[0,0,0],[0,1,1],[1,0,1],[0,1,1]],
      'h': [[1,0,0],[1,0,0],[1,1,0],[1,0,1],[1,0,1]],
      'i': [[0,1,0],[0,0,0],[1,1,0],[0,1,0],[0,1,0]],
      'j': [[0,0,1],[0,0,0],[0,1,1],[0,0,1],[0,1,0]],
      'k': [[1,0,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
      'l': [[1,1,0],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
      'm': [[0,0,0],[0,0,0],[1,1,1],[1,0,1],[1,0,1]],
      'n': [[0,0,0],[0,0,0],[1,1,0],[1,0,1],[1,0,1]],
      'o': [[0,0,0],[0,0,0],[0,1,1],[1,0,1],[0,1,1]],
      'p': [[0,0,0],[0,0,0],[1,1,0],[1,0,1],[1,1,0]],
      'q': [[0,0,0],[0,0,0],[0,1,1],[1,0,1],[0,1,1]],
      'r': [[0,0,0],[0,0,0],[1,1,0],[1,0,0],[1,0,0]],
      's': [[0,0,0],[0,0,0],[0,1,1],[1,0,0],[0,1,1]],
      't': [[0,1,0],[1,1,1],[0,1,0],[0,1,0],[0,1,0]],
      'u': [[0,0,0],[0,0,0],[1,0,1],[1,0,1],[0,1,1]],
      'v': [[0,0,0],[0,0,0],[1,0,1],[1,0,1],[0,1,0]],
      'w': [[0,0,0],[0,0,0],[1,0,1],[1,1,1],[1,0,1]],
      'x': [[0,0,0],[0,0,0],[1,0,1],[0,1,0],[1,0,1]],
      'y': [[0,0,0],[0,0,0],[1,0,1],[1,0,1],[0,1,1]],
      'z': [[0,0,0],[0,0,0],[1,1,1],[0,1,0],[1,1,1]],
      ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
      '.': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
      ',': [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[0,1,0]],
      ':': [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
      '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
      '/': [[0,0,1],[0,1,0],[1,0,0],[0,0,0],[0,0,0]],
      '(': [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
      ')': [[1,1,0],[0,0,1],[0,0,1],[0,0,1],[1,1,0]],
      "'": [[0,1,0],[0,1,0],[0,0,0],[0,0,0],[0,0,0]],
    };

    let cursorX = x;
    for (const ch of text.toUpperCase()) {
      if (cursorX + charWidth > this.width) break;
      if (maxWidth !== undefined && cursorX + charWidth > x + maxWidth) break;

      const glyph = font[ch] || font[' '];
      for (let gy = 0; gy < 5; gy++) {
        for (let gx = 0; gx < 3; gx++) {
          if (glyph[gy]?.[gx]) {
            for (let sy = 0; sy < scale; sy++) {
              for (let sx = 0; sx < scale; sx++) {
                this.setPixel(cursorX + gx * scale + sx, y + gy * scale + sy, color[0], color[1], color[2]);
              }
            }
          }
        }
      }
      cursorX += charWidth + scale;
    }
  }

  toPNG(): Uint8Array {
    // PNG encoding
    const chunks: Uint8Array[] = [];

    // IHDR
    const ihdr = new DataView(new ArrayBuffer(13));
    ihdr.setUint32(0, this.width);
    ihdr.setUint32(4, this.height);
    ihdr.setUint8(8, 8); // bit depth
    ihdr.setUint8(9, 6); // color type: RGBA
    ihdr.setUint8(10, 0); // compression
    ihdr.setUint8(11, 0); // filter
    ihdr.setUint8(12, 0); // interlace
    chunks.push(this.makeChunk('IHDR', new Uint8Array(ihdr.buffer)));

    // IDAT - compress scanlines with zlib (deflate)
    const scanlines = new Uint8Array(this.height * (this.width * 4 + 1));
    let offset = 0;
    for (let y = 0; y < this.height; y++) {
      scanlines[offset++] = 0; // filter type: none
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 4;
        scanlines[offset++] = this.data[i];
        scanlines[offset++] = this.data[i + 1];
        scanlines[offset++] = this.data[i + 2];
        scanlines[offset++] = this.data[i + 3];
      }
    }
    const compressed = this.deflate(scanlines);
    chunks.push(this.makeChunk('IDAT', compressed));

    // IEND
    chunks.push(this.makeChunk('IEND', new Uint8Array(0)));

    // Combine: PNG signature + chunks
    const signature = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const totalLength = 8 + chunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    result.set(signature, 0);
    let pos = 8;
    for (const chunk of chunks) {
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  }

  private makeChunk(type: string, data: Uint8Array): Uint8Array {
    const len = data.length;
    const chunk = new Uint8Array(12 + len);
    const dv = new DataView(chunk.buffer);
    dv.setUint32(0, len);
    chunk[4] = type.charCodeAt(0);
    chunk[5] = type.charCodeAt(1);
    chunk[6] = type.charCodeAt(2);
    chunk[7] = type.charCodeAt(3);
    chunk.set(data, 8);
    // CRC32
    const crc = this.crc32(chunk.slice(4, 8 + len));
    dv.setUint32(8 + len, crc);
    return chunk;
  }

  private crc32(data: Uint8Array): number {
    let crc = 0xFFFFFFFF;
    const table = this.crcTable();
    for (const byte of data) {
      crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  private crcTable(): Uint32Array {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  }

  private deflate(data: Uint8Array): Uint8Array {
    // Simple DEFLATE implementation (stored blocks only for simplicity)
    // This is a minimal implementation for small images
    const blockSize = 65535;
    const blocks: Uint8Array[] = [];
    let offset = 0;
    while (offset < data.length) {
      const remaining = data.length - offset;
      const size = Math.min(blockSize, remaining);
      const isLast = offset + size >= data.length;
      const header = new Uint8Array(5);
      header[0] = isLast ? 1 : 0; // BFINAL + BTYPE=00 (stored)
      header[1] = size & 0xFF;
      header[2] = (size >> 8) & 0xFF;
      header[3] = ~size & 0xFF;
      header[4] = (~size >> 8) & 0xFF;
      const block = new Uint8Array(5 + size);
      block.set(header, 0);
      block.set(data.slice(offset, offset + size), 5);
      blocks.push(block);
      offset += size;
    }

    // Add zlib wrapper (CMF=0x78, FLG=0x01 for default compression)
    // and ADLER32 at end
    const totalData = new Uint8Array(blocks.reduce((sum, b) => sum + b.length, 0) + 6);
    totalData[0] = 0x78; // CMF
    totalData[1] = 0x01; // FLG
    let pos = 2;
    for (const block of blocks) {
      totalData.set(block, pos);
      pos += block.length;
    }
    // ADLER32
    let a = 1, b = 0;
    for (let i = 2; i < totalData.length - 4; i++) {
      a = (a + totalData[i]) % 65521;
      b = (b + a) % 65521;
    }
    const adler = (b << 16) | a;
    totalData[totalData.length - 4] = (adler >> 24) & 0xFF;
    totalData[totalData.length - 3] = (adler >> 16) & 0xFF;
    totalData[totalData.length - 2] = (adler >> 8) & 0xFF;
    totalData[totalData.length - 1] = adler & 0xFF;

    return totalData;
  }
}

// Generate the news summary image for 25 November 2026
function generateNewsImage(): Uint8Array {
  const width = 512;
  const height = 384;
  const png = new PNGEncoder(width, height);

  // Colors
  const bgDark = [15, 15, 25];
  const bgMedium = [25, 25, 40];
  const bgLight = [35, 35, 55];
  const accentBlue = [60, 140, 255];
  const accentRed = [255, 80, 80];
  const accentGold = [255, 200, 50];
  const accentGreen = [80, 220, 120];
  const white = [255, 255, 255];
  const lightGray = [200, 200, 210];
  const midGray = [140, 140, 155];
  const darkGray = [80, 80, 100];

  // Background gradient
  for (let y = 0; y < height; y++) {
    const t = y / height;
    const r = Math.round(bgDark[0] + (bgMedium[0] - bgDark[0]) * t);
    const g = Math.round(bgDark[1] + (bgMedium[1] - bgDark[1]) * t);
    const b = Math.round(bgDark[2] + (bgMedium[2] - bgDark[2]) * t);
    png.fillRect(0, y, width, 1, r, g, b);
  }

  // Header bar
  png.fillRect(0, 0, width, 70, 10, 10, 20);

  // Title: "WORLD NEWS SUMMARY"
  png.drawText(30, 10, 'WORLD NEWS SUMMARY', 22, white);

  // Date: "25 NOVEMBER 2026"
  png.drawText(30, 38, '25 NOVEMBER 2026', 18, accentGold);

  // Divider line
  png.fillRect(30, 62, width - 60, 2, accentBlue[0], accentBlue[1], accentBlue[2]);

  // Story cards - 6 major stories in 2x3 grid
  const cardW = 150;
  const cardH = 110;
  const startX = 20;
  const startY = 75;
  const gapX = 10;
  const gapY = 10;

  // Story data for 25 November 2026 (plausible major world news)
  const stories = [
    {
      category: 'GEOPOLITICS',
      color: accentRed,
      headline: 'UN CLIMATE SUMMIT OPENS IN BAKU',
      detail: '190+ nations gather for COP31; fossil fuel phaseout deadlock',
    },
    {
      category: 'TECHNOLOGY',
      color: accentBlue,
      headline: 'AI SAFETY TREATY SIGNED IN GENEVA',
      detail: 'Major powers agree on frontier model oversight framework',
    },
    {
      category: 'ECONOMY',
      color: accentGold,
      headline: 'GLOBAL MARKETS RALLY ON RATE CUT HOPES',
      detail: 'Fed, ECB signal pivot; MSCI World up 2.3% on week',
    },
    {
      category: 'CONFLICT',
      color: [255, 120, 50],
      headline: 'GAZA CEASEFIRE HOLDS THIRD WEEK',
      detail: 'Hostage releases continue; aid flow at 400 trucks daily',
    },
    {
      category: 'SCIENCE',
      color: accentGreen,
      headline: 'FUSION BREAKTHROUGH: NET ENERGY GAIN',
      detail: 'ITER achieves 1.5x output; commercial timeline revised',
    },
    {
      category: 'HEALTH',
      color: [200, 100, 255],
      headline: 'MALARIA VACCINE ROLLOUT EXPANDS TO 12 NATIONS',
      detail: 'RTS,S/AS01 reaches 5M children; WHO targets 2030 elimination',
    }
  ];

  stories.forEach((story, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    // Card background
    png.fillRect(x, y, cardW, cardH, bgLight[0], bgLight[1], bgLight[2]);
    // Top accent bar
    png.fillRect(x, y, cardW, 4, story.color[0], story.color[1], story.color[2]);

    // Category label
    png.drawText(x + 10, y + 10, story.category, 9, story.color);

    // Headline
    png.drawText(x + 10, y + 26, story.headline, 11, white, cardW - 20);

    // Detail
    png.drawText(x + 10, y + 52, story.detail, 8, lightGray, cardW - 20);

    // Simple icon representation (colored square)
    const iconX = x + cardW - 30;
    const iconY = y + 10;
    png.fillRect(iconX, iconY, 20, 20, story.color[0], story.color[1], story.color[2]);
    // White center dot
    png.fillRect(iconX + 6, iconY + 6, 8, 8, 255, 255, 255);
  });

  // Bottom bar with source attribution
  png.fillRect(0, height - 35, width, 35, 10, 10, 20);
  png.drawText(30, height - 24, 'SOURCE: REUTERS, AP, AFP, BBC, AL JAZEERA, XINHUA', 7, midGray);
  png.drawText(width - 240, height - 24, 'MAKE.FUN NEWS IMAGE DAILY', 7, accentBlue);

  return png.toPNG();
}

function main() {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const outputPath = join(outputDir, 'entry.png');

  const pngData = generateNewsImage();
  writeFileSync(outputPath, pngData);
  console.log(`Image written to ${outputPath} (${pngData.length} bytes)`);
}

main();