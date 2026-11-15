export interface AvatarConfig {
  skinTone: string;
  hairStyle: 'short' | 'curly' | 'long' | 'bun';
  hairColor: string;
  bodyBuild: 'slim' | 'medium' | 'sturdy';
}

export interface ChildProfile {
  id: string;
  name: string;
  photoData?: string;
  avatarConfig: AvatarConfig;
  createdAt: number;
}

const DB_NAME = 'movekit-db';
const DB_VERSION = 1;
const STORE_NAME = 'profiles';
const PROFILES_FALLBACK_KEY = 'movekit_profiles_fallback_v1';

export function getLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setLocalJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof globalThis.indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    try {
      const req = globalThis.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error('IndexedDB error'));
    } catch (err) {
      reject(err);
    }
  });
}

export async function getProfiles(): Promise<ChildProfile[]> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as ChildProfile[]) ?? []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalJson<ChildProfile[]>(PROFILES_FALLBACK_KEY, []);
  }
}

export async function saveProfile(profile: ChildProfile): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(profile);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const current = getLocalJson<ChildProfile[]>(PROFILES_FALLBACK_KEY, []);
    const next = current.filter((p) => p.id !== profile.id);
    next.push(profile);
    setLocalJson(PROFILES_FALLBACK_KEY, next);
  }
}

export async function deleteProfile(id: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const current = getLocalJson<ChildProfile[]>(PROFILES_FALLBACK_KEY, []);
    setLocalJson(
      PROFILES_FALLBACK_KEY,
      current.filter((p) => p.id !== id),
    );
  }
}
