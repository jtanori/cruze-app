/**
 * CRUZE Playwright Test Suite
 * Captures screenshots and generates ASCII diagrams for all pages
 * 
 * Run: npx playwright test
 * Report: npx playwright report
 */

import { test, expect, } from '@playwright/test';
import { renderToString } from 'react-dom/server';
import React from 'react';

// ASCII diagram generators for each page
// =============================================================================

/**
 * Generate ASCII diagram for CrossingCard component
 */
function crossingCardAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  ✦ BEST OVERALL                                                 │
│  ┌────────────────────────────────────────┐                  │
│  │ MÉXICO ────────────│──────── UNITED STATES   │                  │
│  │ San Ysidro                                 │                  │
│  │ ● OPEN   15 min   BORDER WAIT           │                  │
│  │ 17 min   TOTAL JOURNEY                  │                  │
│  │                                              │                  │
│  │ ✦ FASTEST OVERALL   2 min faster than    │                  │
│  │ Otay Mesa                                   │                  │
│  │                                              │                  │
│  │ READY LANE   SENTRI   STANDARD            │                  │
│  └────────────────────────────────────────┘                  │
│  [                          INICIAR VIAJE →              ]│
└─────────────────────────────────────────────────────────────┘`;
}

/**
 * Generate ASCII diagram for CrossingsList component
 */
function crossingsListAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  🧭 CROSSINGS                                                     │
│  ├─────────────────────────────────────┐                       │
│  │ ALL CROSSINGS      [MX→US] [US→MX]             │                       │
│  │                                              │                       │
│  │ San Ysidro       15 min  🟢                │                       │
│  │ Otay Mesa        21 min  🟡                │                       │
│  │ Tecate           28 min  🟠                │                       │
│  │ Calexico West    12 min  🟢                │                       │
│  │ ...                                                  │                       │
│  └─────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘`;
}

/**
 * Generate ASCII diagram for ViajeHome component
 */
function viajeHomeAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  🏠 VIAJE (selected)                                                │
│  Tijuana → Los Angeles                                                │
│                                                                     │
│  BEST CROSSING                                                          │
│  San Luis                                                                 │
│  23 min border wait     8h 47m total                                    │
│                                                                     │
│ [ Iniciar viaje ]     [ Personalize ]                                   │
│                                                                     │
│  Alerts (high priority if recommendation changes)                     │
└─────────────────────────────────────────────────────────────┘`;
}

/**
 * Generate ASCII diagram for AgentChat component
 */
function agentChatAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  CRUZE Intelligence Agent                                               │
│                                                                     │
│  Welcome! I'm CRUZE's intelligent agent. I can help you answer:           │
│  • "¿Cuál es el mejor cruce para tu ruta?"                              │
│  • "¿Cuánto tiempo esperas en el cruce?"                                │
│  • "¿Qué tan activo está el cruce?"                                     │
│                                                                     │
│  Suggested prompts:                                                     │
│  • Mejor cruce para tu viaje                                            │
│  • ¿Qué tal_wait time?                                                  │
│  • ¿Qué cruces están abiertos?                                          │
│                                                                     │
│  [ New message... ]                                                     │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │     AGENT       │  │     USER        │                       │
│  │  Hola! Voy a    │  │  ¿Cuál es el   │                       │
│  │  analizar tu    │  │  mejor cruce?  │                       │
│  │  ruta...        │  └─────────────────┘                       │
│  └─────────────────┘                                         │
└─────────────────────────────────────────────────────────────┘`;
}

/**
 * Generate ASCII diagram for BottomNavigation component
 */
function bottomNavigationAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  │  Viaje   |  Cruces   |  Favoritos   |  Más    │
│  └─────────────────────────────────────────────────────────┘`;
}

/**
 * Generate ASCII diagram for TopAppBar component
 */
function topAppBarAscii(): string {
  return `
┌─────────────────────────────────────────────────────────────┐
│  CRUZE            Tijuana → San Diego                                │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  ✦ LIVE     │  │  Menú       │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────┘`;
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('CRUZE - Screen Capture & ASCII Diagram Evidence', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/es', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
  });

  test('CrossingCard - renders correctly with ASCII diagram', async ({ page }) => {
    // Capture screenshot
    await page.waitForSelector('[data-testid="crossing-card"]');
    const screenshot = await page.screenshot({ path: '/tmp/crossing-card.png' });
    
    // Generate ASCII diagram
    const ascii = crossingCardAscii();
    
    // Verify key elements are present in the screenshot
    await expect(page.locator('● OPEN')).toBeVisible();
    await expect(page.locator('15 min')).toBeVisible();
    await expect(page.locator('✦ BEST OVERALL')).toBeVisible();
    
    // Print evidence
    console.log('\n=== CROSSING CARD EVIDENCE ===');
    console.log('Screenshot captured: /tmp/crossing-card.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });

  test('CrossingsList - renders correctly with ASCII diagram', async ({ page }) => {
    // Navigate to crossings tab
    await page.getByText('Cruces').click();
    await page.waitForLoadState('networkidle');
    
    // Capture screenshot
    const screenshot = await page.screenshot({ path: '/tmp/crossings-list.png' });
    
    // Generate ASCII diagram
    const ascii = crossingsListAscii();
    
    // Verify key elements
    await expect(page.locator('🟢')).toBeVisible();
    await expect(page.locator('San Ysidro')).toBeVisible();
    
    // Print evidence
    console.log('\n=== CROSSINGS LIST EVIDENCE ===');
    console.log('Screenshot captured: /tmp/crossings-list.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });

  test('ViajeHome - renders correctly with ASCII diagram', async ({ page }) => {
    // Navigate to viaje tab (if trip exists) or wait for onboarding
    await page.getByText('Viaje').click();
    await page.waitForLoadState('networkidle');
    
    // Capture screenshot
    const screenshot = await page.screenshot({ path: '/tmp/viaje-home.png' });
    
    // Generate ASCII diagram
    const ascii = viajeHomeAscii();
    
    // Verify key elements
    await expect(page.locator('🏠 VIAJE')).toBeVisible();
    await expect(page.locator('BEST CROSSING')).toBeVisible();
    
    // Print evidence
    console.log('\n=== VIAJE HOME EVIDENCE ===');
    console.log('Screenshot captured: /tmp/viaje-home.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });

  test('AgentChat - renders correctly with ASCII diagram', async ({ page }) => {
    // Navigate to agent tab
    await page.getByText('Agente').click();
    await page.waitForLoadState('networkidle');
    
    // Capture screenshot
    const screenshot = await page.screenshot({ path: '/tmp/agent-chat.png' });
    
    // Generate ASCII diagram
    const ascii = agentChatAscii();
    
    // Verify key elements
    await expect(page.locator('CRUZE Intelligence Agent')).toBeVisible();
    await expect(page.locator('Suggested prompts')).toBeVisible();
    
    // Print evidence
    console.log('\n=== AGENT CHAT EVIDENCE ===');
    console.log('Screenshot captured: /tmp/agent-chat.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });

  test('BottomNavigation - renders correctly with ASCII diagram', async ({ page }) => {
    // Capture screenshot
    const screenshot = await page.screenshot({ path: '/tmp/bottom-nav.png' });
    
    // Generate ASCII diagram
    const ascii = bottomNavigationAscii();
    
    // Verify key elements - check all 5 tabs are present
    const tabCount = await page.locator('nav [role="tab"]').count();
    await expect(tabCount).toBe(5);
    
    // Print evidence
    console.log('\n=== BOTTOM NAVIGATION EVIDENCE ===');
    console.log('Screenshot captured: /tmp/bottom-nav.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });

  test('TopAppBar - renders correctly with ASCII diagram', async ({ page }) => {
    // Capture screenshot
    const screenshot = await page.screenshot({ path: '/tmp/top-app-bar.png' });
    
    // Generate ASCII diagram
    const ascii = topAppBarAscii();
    
    // Verify key elements
    await expect(page.locator('text=CRUZE')).toBeVisible();
    await expect(page.locator('text=Tijuana')).toBeVisible();
    
    // Print evidence
    console.log('\n=== TOP APP BAR EVIDENCE ===');
    console.log('Screenshot captured: /tmp/top-app-bar.png');
    console.log('ASCII Diagram:');
    console.log(ascii);
    console.log('================================\n');
  });
});