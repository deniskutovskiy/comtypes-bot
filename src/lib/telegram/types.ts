/**
 * Telegram WebApp API Types
 * Simplified version covering only features used in this app
 */

export interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  auth_date?: number;
  hash?: string;
  start_param?: string;
}

export interface CloudStorage {
  setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): void;
  getItem(key: string, callback: (error: Error | null, value: string | null) => void): void;
  getItems(keys: string[], callback: (error: Error | null, values: Record<string, string>) => void): void;
  removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): void;
  removeItems(keys: string[], callback?: (error: Error | null, success: boolean) => void): void;
  getKeys(callback: (error: Error | null, keys: string[]) => void): void;
}

export type HapticFeedbackStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
export type HapticNotificationType = 'error' | 'success' | 'warning';

export interface HapticFeedback {
  impactOccurred(style: HapticFeedbackStyle): void;
  notificationOccurred(type: HapticNotificationType): void;
  selectionChanged(): void;
}

export interface WebApp {
  // Initialization
  ready(): void;
  expand(): void;
  close(): void;

  // User data
  initData: string;
  initDataUnsafe: WebAppInitData;

  // Platform info
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';

  // Features
  CloudStorage: CloudStorage;
  HapticFeedback: HapticFeedback;

  // Utils
  isVersionAtLeast(version: string): boolean;
}
