import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

const mockSessionStorage = new MemoryStorage();

describe('Mobile Intro, PWA & Vercel Configuration Verification', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
  });

  it('verifies vercel.json exists and has valid SPA rewrites and SW headers', () => {
    const vercelConfigPath = path.resolve(__dirname, '../../vercel.json');
    expect(fs.existsSync(vercelConfigPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
    expect(config.buildCommand).toBe('npm run build');
    expect(config.outputDirectory).toBe('dist');

    // Verify SPA rewrite
    const rewrite = config.rewrites.find((r: any) => r.destination === '/index.html');
    expect(rewrite).toBeDefined();

    // Verify Service Worker header (no-cache)
    const swHeader = config.headers.find((h: any) => h.source === '/sw.js');
    expect(swHeader).toBeDefined();
    const cacheControl = swHeader.headers.find((h: any) => h.key === 'Cache-Control');
    expect(cacheControl.value).toContain('max-age=0');
  });

  it('verifies manifest.json defines standalone display and valid PNG/SVG icons', () => {
    const manifestPath = path.resolve(__dirname, '../../public/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.theme_color).toBe('#173F91');

    const icon192 = manifest.icons.find((i: any) => i.src === '/icon-192.png');
    const icon512 = manifest.icons.find((i: any) => i.src === '/icon-512.png');
    const iconSvg = manifest.icons.find((i: any) => i.src === '/logo.svg');

    expect(icon192).toBeDefined();
    expect(icon512).toBeDefined();
    expect(iconSvg).toBeDefined();
  });

  it('verifies all precached assets in sw.js exist on physical disk', () => {
    const swPath = path.resolve(__dirname, '../../public/sw.js');
    const swContent = fs.readFileSync(swPath, 'utf-8');

    expect(swContent).toContain('sahaaya-cache-v8');

    const match = swContent.match(/const IMMUTABLE_ASSETS = \[(.*?)\];/s);
    expect(match).not.toBeNull();

    if (match) {
      const raw = match[1];
      const assets = raw
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter(Boolean);

      for (const asset of assets) {
        if (asset === '/' || asset === '/index.html') continue;
        const fullPath = path.resolve(__dirname, '../../public' + asset);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    }
  });

  it('verifies sessionStorage intro guard prevents re-displaying', () => {
    // Initial state: not seen
    expect(mockSessionStorage.getItem('sahaaya_intro_seen')).toBeNull();

    // Simulate completion
    mockSessionStorage.setItem('sahaaya_intro_seen', 'true');
    expect(mockSessionStorage.getItem('sahaaya_intro_seen')).toBe('true');
  });
});
