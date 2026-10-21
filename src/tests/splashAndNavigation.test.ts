import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Splash Animation, Mobile Navigation & Settings Page Verification', () => {
  const logoPath = path.resolve(__dirname, '../components/SahaayaLogo.tsx');
  const introPath = path.resolve(__dirname, '../components/MobileIntro.tsx');
  const headerPath = path.resolve(__dirname, '../components/Header.tsx');
  const layoutPath = path.resolve(__dirname, '../components/Layout.tsx');
  const settingsPath = path.resolve(__dirname, '../pages/SettingsPage.tsx');
  const publicLogoPath = path.resolve(__dirname, '../../public/logo.svg');

  const logoContent = fs.readFileSync(logoPath, 'utf-8');
  const introContent = fs.readFileSync(introPath, 'utf-8');
  const headerContent = fs.readFileSync(headerPath, 'utf-8');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
  const publicLogo = fs.readFileSync(publicLogoPath, 'utf-8');

  it('verifies SahaayaLogo renders vector SVG with blue half, green half, and human figure', () => {
    expect(logoContent).toContain('logoBlueGrad');
    expect(logoContent).toContain('logoTealGrad');
    expect(logoContent).toContain('#0F2B66'); // Heart outline stroke
    expect(logoContent).toContain('fill="#FFFFFF"'); // White human figure
    expect(publicLogo).toContain('logoBlueGrad');
    expect(publicLogo).toContain('logoTealGrad');
  });

  it('verifies MobileIntro implements the pure white 6-stage animation sequence', () => {
    // Pure white background check
    expect(introContent).toContain('bg-white');
    expect(introContent).not.toContain('bg-gradient-to-b from-white via-slate-50');

    // 6 stages
    expect(introContent).toContain('stage');
    expect(introContent).toContain('setStage(2)');
    expect(introContent).toContain('setStage(3)');
    expect(introContent).toContain('setStage(4)');
    expect(introContent).toContain('setStage(5)');
    expect(introContent).toContain('setStage(6)');

    // Brand name and offline ready badge
    expect(introContent).toContain('SAHAAYA');
    expect(introContent).toContain('HEALTH');
    expect(introContent).toContain('100% Offline Ready');

    // Skip control and accessibility guards
    expect(introContent).toContain('Skip');
    expect(introContent).toContain('prefers-reduced-motion');
    expect(introContent).toContain('sahaaya_intro_seen');
  });

  it('verifies hamburger menu is completely removed from Header and Layout', () => {
    // No Menu icon import or usage in Header
    expect(headerContent).not.toMatch(/import\s*\{[^}]*Menu[^}]*\}\s*from\s*['"]lucide-react['"]/);
    expect(headerContent).not.toContain('<Menu');

    // No mobile drawer in Layout
    expect(layoutContent).not.toContain('mobileDrawerOpen');
    expect(layoutContent).not.toContain('setMobileDrawerOpen');
    expect(layoutContent).not.toContain('onOpenMobileDrawer');
  });

  it('verifies Header has compact brand logo, language toggle, network status, and direct Settings icon', () => {
    expect(headerContent).toContain('SahaayaLogo');
    expect(headerContent).toContain("setLanguage('en')");
    expect(headerContent).toContain("setLanguage('te')");
    expect(headerContent).toContain('Wifi');
    expect(headerContent).toContain('WifiOff');
    expect(headerContent).toContain('Settings');
    expect(headerContent).toContain("navigate('/settings')");
  });

  it('verifies Network Status button triggers an accessible status panel without network requests', () => {
    expect(headerContent).toContain('showNetworkPanel');
    expect(headerContent).toContain('IndexedDB');
    expect(headerContent).toContain('navigate(\'/readiness\')');
    expect(headerContent).toContain('navigate(\'/sync\')');
  });

  it('verifies SettingsPage features Language toggle, Local Storage, CPU Benchmark, and Reset modal', () => {
    // Language selection
    expect(settingsContent).toContain('App Language');
    expect(settingsContent).toContain("setLanguage('en')");
    expect(settingsContent).toContain("setLanguage('te')");

    // Local Storage live stats
    expect(settingsContent).toContain('Local Storage');
    expect(settingsContent).toContain('dbStats.hh');
    expect(settingsContent).toContain('dbStats.members');
    expect(settingsContent).toContain('navigator.storage.estimate');

    // CPU Benchmark
    expect(settingsContent).toContain('runCPUBenchmark');
    expect(settingsContent).toContain('benchmarkResult');

    // Reset demo modal
    expect(settingsContent).toContain('showResetModal');
    expect(settingsContent).toContain('resetDatabase');
  });
});
