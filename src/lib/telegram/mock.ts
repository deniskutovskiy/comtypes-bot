/**
 * Telegram WebApp Mock Implementation
 * Provides full-featured mock for development and testing
 */

import type {
  WebApp,
  WebAppUser,
  WebAppInitData,
  CloudStorage,
  HapticFeedback,
  HapticFeedbackStyle,
  HapticNotificationType,
} from "./types";

// Prefix for localStorage keys to avoid conflicts
const STORAGE_PREFIX = "__tg_cloud_storage__";

/**
 * Mock CloudStorage implementation using localStorage
 */
class MockCloudStorage implements CloudStorage {
  private getFullKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  setItem(
    key: string,
    value: string,
    callback?: (error: Error | null, success: boolean) => void
  ): void {
    try {
      localStorage.setItem(this.getFullKey(key), value);
      callback?.(null, true);
    } catch (error) {
      callback?.(error as Error, false);
    }
  }

  getItem(
    key: string,
    callback: (error: Error | null, value: string | null) => void
  ): void {
    try {
      const value = localStorage.getItem(this.getFullKey(key));
      callback(null, value);
    } catch (error) {
      callback(error as Error, null);
    }
  }

  getItems(
    keys: string[],
    callback: (error: Error | null, values: Record<string, string>) => void
  ): void {
    try {
      const values: Record<string, string> = {};
      keys.forEach((key) => {
        const value = localStorage.getItem(this.getFullKey(key));
        if (value !== null) {
          values[key] = value;
        }
      });
      callback(null, values);
    } catch (error) {
      callback(error as Error, {});
    }
  }

  removeItem(
    key: string,
    callback?: (error: Error | null, success: boolean) => void
  ): void {
    try {
      localStorage.removeItem(this.getFullKey(key));
      callback?.(null, true);
    } catch (error) {
      callback?.(error as Error, false);
    }
  }

  removeItems(
    keys: string[],
    callback?: (error: Error | null, success: boolean) => void
  ): void {
    try {
      keys.forEach((key) => localStorage.removeItem(this.getFullKey(key)));
      callback?.(null, true);
    } catch (error) {
      callback?.(error as Error, false);
    }
  }

  getKeys(callback: (error: Error | null, keys: string[]) => void): void {
    try {
      const allKeys = Object.keys(localStorage);
      const tgKeys = allKeys
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .map((key) => key.replace(STORAGE_PREFIX, ""));
      callback(null, tgKeys);
    } catch (error) {
      callback(error as Error, []);
    }
  }
}

/**
 * Mock HapticFeedback implementation with console logging
 */
class MockHapticFeedback implements HapticFeedback {
  impactOccurred(style: HapticFeedbackStyle): void {
    console.log(`[Telegram Mock] Haptic impact: ${style}`);
  }

  notificationOccurred(type: HapticNotificationType): void {
    console.log(`[Telegram Mock] Haptic notification: ${type}`);
  }

  selectionChanged(): void {
    console.log("[Telegram Mock] Haptic selection changed");
  }
}

/**
 * Default mock user data
 */
const DEFAULT_MOCK_USER: WebAppUser = {
  id: 12345678,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "en",
  is_premium: false,
};

/**
 * Mock state that can be controlled via window.telegramMock
 */
class MockState {
  user: WebAppUser = { ...DEFAULT_MOCK_USER };

  setUser(user: Partial<WebAppUser>): void {
    this.user = { ...this.user, ...user };
    console.log("[Telegram Mock] User updated:", this.user);
  }

  resetUser(): void {
    this.user = { ...DEFAULT_MOCK_USER };
    console.log("[Telegram Mock] User reset to default");
  }
}

const mockState = new MockState();

/**
 * Mock WebApp implementation
 */
class MockWebApp implements WebApp {
  private cloudStorage = new MockCloudStorage();
  private hapticFeedback = new MockHapticFeedback();

  // Initialization methods
  ready(): void {
    console.log("[Telegram Mock] WebApp.ready() called");
  }

  expand(): void {
    console.log("[Telegram Mock] WebApp.expand() called");
  }
  disableVerticalSwipes(): void {
    console.log("[Telegram Mock] WebApp.disableVerticalSwipes() called");
  }

  requestFullscreen(): void {
    console.log("[Telegram Mock] WebApp.requestFullscreen() called");
  }

  close(): void {
    console.log("[Telegram Mock] WebApp.close() called");
  }

  // User data
  get initData(): string {
    return JSON.stringify(this.initDataUnsafe);
  }

  get initDataUnsafe(): WebAppInitData {
    return {
      user: mockState.user,
      auth_date: Math.floor(Date.now() / 1000),
      hash: "mock_hash",
    };
  }

  // Platform info
  version = "7.0";
  platform = "web";
  colorScheme: "light" | "dark" = "light";

  // Features
  get CloudStorage(): CloudStorage {
    return this.cloudStorage;
  }

  get HapticFeedback(): HapticFeedback {
    return this.hapticFeedback;
  }

  // Utils
  isVersionAtLeast(version: string): boolean {
    return parseFloat(this.version) >= parseFloat(version);
  }
}

/**
 * Global API for controlling mock (window.telegramMock)
 */
export interface TelegramMockAPI {
  setUser(user: Partial<WebAppUser>): void;
  resetUser(): void;
  clearStorage(): void;
  getStorage(): Record<string, string>;
  setStorage(key: string, value: string): void;
  triggerHaptic(style: HapticFeedbackStyle): void;
}

/**
 * Extend Window interface to include telegramMock
 */
declare global {
  interface Window {
    telegramMock?: TelegramMockAPI;
  }
}

/**
 * Create and configure global mock API
 */
export function setupMockAPI(webApp: MockWebApp): void {
  const api: TelegramMockAPI = {
    setUser: (user) => mockState.setUser(user),
    resetUser: () => mockState.resetUser(),

    clearStorage: () => {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(STORAGE_PREFIX)
      );
      keys.forEach((key) => localStorage.removeItem(key));
      console.log("[Telegram Mock] Storage cleared");
    },

    getStorage: () => {
      const storage: Record<string, string> = {};
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const cleanKey = key.replace(STORAGE_PREFIX, "");
          const value = localStorage.getItem(key);
          if (value) storage[cleanKey] = value;
        }
      });
      console.log("[Telegram Mock] Current storage:", storage);
      return storage;
    },

    setStorage: (key, value) => {
      // Check if key contains dots (nested path)
      if (key.includes(".")) {
        const parts = key.split(".");
        const rootKey = parts[0];
        const fullKey = `${STORAGE_PREFIX}${rootKey}`;

        // Get existing root object or create new one
        let rootObj: Record<string, unknown> = {};
        const existing = localStorage.getItem(fullKey);
        if (existing) {
          try {
            rootObj = JSON.parse(existing) as Record<string, unknown>;
          } catch {
            rootObj = {};
          }
        }

        // Set value at nested path
        let current: Record<string, unknown> = rootObj;
        for (let i = 1; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]] as Record<string, unknown>;
        }
        current[parts[parts.length - 1]] = value;

        // Save back as JSON
        localStorage.setItem(fullKey, JSON.stringify(rootObj));
        console.log(`[Telegram Mock] Storage updated: ${key} = ${value}`);
      } else {
        // Simple key - save as is
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
        console.log(`[Telegram Mock] Storage updated: ${key} = ${value}`);
      }
    },

    triggerHaptic: (style) => webApp.HapticFeedback.impactOccurred(style),
  };

  // Expose globally
  window.telegramMock = api;
  console.log(
    "[Telegram Mock] Control API available via window.telegramMock\n" +
      "Available methods:\n" +
      "  - setUser(user: Partial<WebAppUser>)\n" +
      "  - resetUser()\n" +
      "  - clearStorage()\n" +
      "  - getStorage()\n" +
      "  - setStorage(key: string, value: string)\n" +
      '  - triggerHaptic(style: "light" | "medium" | "heavy" | "rigid" | "soft")'
  );
}

/**
 * Create mock WebApp instance
 */
export function createMockWebApp(): WebApp {
  const mockWebApp = new MockWebApp();
  setupMockAPI(mockWebApp);
  return mockWebApp;
}
