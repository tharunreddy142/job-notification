import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'jobTrackerPreferences';

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

const defaultPreferences: Preferences = {
  roleKeywords: '',
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40,
};

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferencesState({ ...defaultPreferences, ...parsed });
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  const setPreferences = useCallback((newPreferences: Preferences) => {
    setPreferencesState(newPreferences);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const updatePreference = useCallback(<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  const hasPreferences = useCallback(() => {
    return !!(
      preferences.roleKeywords ||
      preferences.preferredLocations.length > 0 ||
      preferences.preferredMode.length > 0 ||
      preferences.experienceLevel ||
      preferences.skills
    );
  }, [preferences]);

  const clearPreferences = useCallback(() => {
    setPreferencesState(defaultPreferences);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  return {
    preferences,
    isLoaded,
    setPreferences,
    updatePreference,
    hasPreferences,
    clearPreferences,
  };
}
