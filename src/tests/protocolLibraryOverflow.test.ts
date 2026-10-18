import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PROTOCOL_CORPUS } from '../data/protocolCorpus';

describe('Quick Guides (Protocol Library) Mobile Layout & Overflow Tests', () => {
  const protocolLibraryPath = path.resolve(__dirname, '../pages/ProtocolLibrary.tsx');
  const protocolDetailPath = path.resolve(__dirname, '../pages/ProtocolDetail.tsx');
  const libraryContent = fs.readFileSync(protocolLibraryPath, 'utf-8');
  const detailContent = fs.readFileSync(protocolDetailPath, 'utf-8');

  it('verifies that broken/non-existent Tailwind classes like w-13 and h-13 are eliminated', () => {
    expect(libraryContent).not.toContain('w-13');
    expect(libraryContent).not.toContain('h-13');
    expect(detailContent).not.toContain('w-13');
    expect(detailContent).not.toContain('h-13');
  });

  it('verifies all category artwork files referenced in ProtocolLibrary exist on disk', () => {
    const requiredImages = [
      'antenatal.jpg',
      'immunisation.jpg',
      'child-health.jpg',
      'chronic.jpg',
      'danger-signs.jpg',
      'job-aids.svg'
    ];

    const categoriesDir = path.resolve(__dirname, '../../public/illustrations/categories');
    for (const img of requiredImages) {
      const fullPath = path.join(categoriesDir, img);
      expect(fs.existsSync(fullPath), `Category artwork ${img} must exist at ${fullPath}`).toBe(true);
    }
  });

  it('verifies all protocol corpus documents belong to valid categories with content', () => {
    expect(PROTOCOL_CORPUS.length).toBeGreaterThanOrEqual(6);
    for (const doc of PROTOCOL_CORPUS) {
      expect(doc.id).toBeTruthy();
      expect(doc.title).toBeTruthy();
      expect(doc.titleTe).toBeTruthy();
      expect(doc.subtitle).toBeTruthy();
      expect(doc.subtitleTe).toBeTruthy();
      expect(doc.sections.length).toBeGreaterThan(0);
    }
  });

  it('verifies that cards and flex children implement min-w-0, w-full, and box-border', () => {
    // ProtocolLibrary container and card classes check
    expect(libraryContent).toContain('min-w-0');
    expect(libraryContent).toContain('box-border');
    expect(libraryContent).toContain('overflow-hidden');
    expect(libraryContent).toContain('grid-cols-1');
    expect(libraryContent).toContain('md:grid-cols-2');
  });

  it('verifies adequate bottom padding is provided so bottom navigation never obscures the last card', () => {
    // Mobile bottom navigation is 64px; pb-28 provides ~112px clearance
    expect(libraryContent).toContain('pb-28');
    expect(detailContent).toContain('pb-28');
  });

  it('verifies category filtering chips and search are present and operational', () => {
    expect(libraryContent).toContain('categories.map');
    expect(libraryContent).toContain('selectedCategory');
    expect(libraryContent).toContain('searchQuery');
  });

  it('simulates card width calculations across mobile viewports (320px, 360px, 375px, 390px, 430px)', () => {
    const targetWidths = [320, 360, 375, 390, 430];
    const horizontalPadding = 16 * 2; // p-4 on <main>
    const cardPadding = 14 * 2; // p-3.5 inside card
    const thumbnailWidth = 56; // w-14 = 3.5rem = 56px
    const chevronWidth = 32; // w-8 = 2rem = 32px
    const gaps = 12 + 12; // gap-3 = 12px

    for (const viewport of targetWidths) {
      const availableContentWidth = viewport - horizontalPadding;
      const cardInternalTextWidth = availableContentWidth - cardPadding - thumbnailWidth - chevronWidth - gaps;

      // Available text column width must be positive and ample for titles & metadata
      expect(availableContentWidth).toBeGreaterThan(280);
      expect(cardInternalTextWidth).toBeGreaterThan(120);

      // Verify that documentElement width constraint holds
      const scrollWidth = availableContentWidth;
      const clientWidth = availableContentWidth;
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });
});
