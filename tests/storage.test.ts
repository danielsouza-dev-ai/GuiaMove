import { beforeEach, describe, expect, it } from 'vitest';
import {
  deleteProfile,
  getLocalJson,
  getProfiles,
  saveProfile,
  setLocalJson,
  type ChildProfile,
} from '@/utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when key is missing or JSON is invalid', () => {
    expect(getLocalJson('missing-key', { ok: true })).toEqual({ ok: true });
    localStorage.setItem('bad-json', '{invalid');
    expect(getLocalJson('bad-json', [1, 2])).toEqual([1, 2]);
  });

  it('persists and reads JSON values in localStorage', () => {
    setLocalJson('pref', { muted: true, level: 2 });
    expect(getLocalJson('pref', { muted: false, level: 0 })).toEqual({
      muted: true,
      level: 2,
    });
  });

  it('saves, lists, and deletes child profiles via localStorage fallback when indexedDB is unavailable', async () => {
    const originalIdb = globalThis.indexedDB;
    Object.defineProperty(globalThis, 'indexedDB', {
      value: undefined,
      configurable: true,
    });

    try {
      const profile: ChildProfile = {
        id: 'child-1',
        name: 'Murilo',
        avatarConfig: {
          skinTone: '#E0AC69',
          hairStyle: 'short',
          hairColor: '#2C1B18',
          bodyBuild: 'medium',
        },
        createdAt: 1000,
      };

      await saveProfile(profile);
      const list = await getProfiles();
      expect(list).toHaveLength(1);
      expect(list[0].name).toBe('Murilo');

      await deleteProfile('child-1');
      expect(await getProfiles()).toEqual([]);
    } finally {
      Object.defineProperty(globalThis, 'indexedDB', {
        value: originalIdb,
        configurable: true,
      });
    }
  });
});
