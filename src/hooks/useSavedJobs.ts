import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'job-notification-tracker-saved';

export function useSavedJobs() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedJobIds(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  const saveJob = useCallback((jobId: string) => {
    setSavedJobIds(prev => {
      if (prev.includes(jobId)) return prev;
      const updated = [...prev, jobId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  const unsaveJob = useCallback((jobId: string) => {
    setSavedJobIds(prev => {
      const updated = prev.filter(id => id !== jobId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  const isSaved = useCallback((jobId: string) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  const toggleSave = useCallback((jobId: string) => {
    if (isSaved(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  }, [isSaved, saveJob, unsaveJob]);

  return {
    savedJobIds,
    isLoaded,
    saveJob,
    unsaveJob,
    isSaved,
    toggleSave
  };
}
