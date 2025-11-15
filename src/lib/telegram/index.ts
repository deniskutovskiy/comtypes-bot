/**
 * Telegram WebApp Wrapper
 * Automatically detects environment and provides appropriate implementation
 */

import type { WebApp as WebAppType } from './types';
import { createMockWebApp } from './mock';

// Extend Window interface for Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: WebAppType;
    };
  }
}

/**
 * Check if running inside Telegram WebApp
 */
function isTelegramEnvironment(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/**
 * Get WebApp instance (real or mock)
 */
function getWebApp(): WebAppType {
  if (isTelegramEnvironment()) {
    console.log('[Telegram] Using real Telegram WebApp SDK');
    // Use real Telegram WebApp
    return window.Telegram!.WebApp;
  } else {
    console.log('[Telegram] Telegram not detected, using mock implementation');
    // Use mock implementation
    return createMockWebApp();
  }
}

/**
 * Singleton WebApp instance
 */
const WebApp = getWebApp();

// Export as default (compatible with @twa-dev/sdk default export pattern)
export default WebApp;

// Also export types
export type * from './types';
