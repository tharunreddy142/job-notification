import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'jobTrackerTestStatus';

export interface ChecklistItem {
  id: string;
  label: string;
  howToTest: string;
}

export const TEST_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'preferences-persist', label: 'Preferences persist after refresh', howToTest: 'Save preferences in Settings, refresh, and confirm values are prefilled.' },
  { id: 'match-score-correct', label: 'Match score calculates correctly', howToTest: 'Set known preferences and verify score components align with scoring rules.' },
  { id: 'show-only-matches', label: '"Show only matches" toggle works', howToTest: 'Enable toggle and verify only jobs above threshold remain visible.' },
  { id: 'save-job-persist', label: 'Save job persists after refresh', howToTest: 'Save a job on Dashboard, refresh, and confirm it remains in Saved.' },
  { id: 'apply-new-tab', label: 'Apply opens in new tab', howToTest: 'Click Apply and verify a new browser tab opens for the job link.' },
  { id: 'status-persist', label: 'Status update persists after refresh', howToTest: 'Set a status on a job, refresh, and verify status remains selected.' },
  { id: 'status-filter', label: 'Status filter works correctly', howToTest: 'Set statuses on multiple jobs and filter by one status on Dashboard.' },
  { id: 'digest-top-10', label: 'Digest generates top 10 by score', howToTest: 'Generate digest and validate order by matchScore desc, then postedDaysAgo asc.' },
  { id: 'digest-persists-day', label: 'Digest persists for the day', howToTest: 'Generate digest, refresh page, and confirm same daily digest is loaded.' },
  { id: 'no-console-errors', label: 'No console errors on main pages', howToTest: 'Open browser console and navigate Home, Dashboard, Saved, Digest, Settings.' },
];

type ChecklistState = Record<string, boolean>;

function buildDefaultState(): ChecklistState {
  return TEST_CHECKLIST_ITEMS.reduce<ChecklistState>((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

export function useTestChecklist() {
  const [state, setState] = useState<ChecklistState>(buildDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object') {
          const defaults = buildDefaultState();
          const hydrated = { ...defaults };
          for (const item of TEST_CHECKLIST_ITEMS) {
            hydrated[item.id] = Boolean(parsed[item.id]);
          }
          setState(hydrated);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((nextState: ChecklistState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleItem = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      persist(next);
      return next;
    });
  }, [persist]);

  const reset = useCallback(() => {
    const defaults = buildDefaultState();
    setState(defaults);
    persist(defaults);
  }, [persist]);

  const passedCount = useMemo(
    () => TEST_CHECKLIST_ITEMS.filter((item) => state[item.id]).length,
    [state]
  );

  const totalCount = TEST_CHECKLIST_ITEMS.length;
  const allPassed = passedCount === totalCount;

  return {
    checklistState: state,
    isLoaded,
    toggleItem,
    reset,
    passedCount,
    totalCount,
    allPassed,
  };
}
