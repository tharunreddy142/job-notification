import { useCallback, useEffect, useMemo, useState } from 'react';

const STATUS_STORAGE_KEY = 'jobTrackerStatus';
const STATUS_UPDATES_STORAGE_KEY = 'jobTrackerStatusUpdates';
const MAX_UPDATES = 20;

export const JOB_STATUSES = ['Not Applied', 'Applied', 'Rejected', 'Selected'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

export interface JobStatusUpdate {
  jobId: string;
  title: string;
  company: string;
  status: JobStatus;
  changedAt: string;
}

type StatusMap = Record<string, JobStatus>;
const validStatuses = new Set<JobStatus>(JOB_STATUSES);

export function useJobStatus() {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [statusUpdates, setStatusUpdates] = useState<JobStatusUpdate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedStatuses = localStorage.getItem(STATUS_STORAGE_KEY);
      if (storedStatuses) {
        const parsed = JSON.parse(storedStatuses) as Record<string, string>;
        if (parsed && typeof parsed === 'object') {
          const sanitized: StatusMap = {};
          for (const [jobId, status] of Object.entries(parsed)) {
            sanitized[jobId] = validStatuses.has(status as JobStatus) ? (status as JobStatus) : 'Not Applied';
          }
          setStatusMap(sanitized);
        }
      }

      const storedUpdates = localStorage.getItem(STATUS_UPDATES_STORAGE_KEY);
      if (storedUpdates) {
        const parsed = JSON.parse(storedUpdates) as Array<Omit<JobStatusUpdate, 'status'> & { status: string }>;
        if (Array.isArray(parsed)) {
          const sanitized = parsed
            .filter((entry) => entry && typeof entry === 'object')
            .map((entry) => ({
              ...entry,
              status: validStatuses.has(entry.status as JobStatus) ? (entry.status as JobStatus) : 'Not Applied',
            }));
          setStatusUpdates(sanitized);
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    setIsLoaded(true);
  }, []);

  const getStatus = useCallback(
    (jobId: string): JobStatus => statusMap[jobId] ?? 'Not Applied',
    [statusMap]
  );

  const setJobStatus = useCallback((update: Omit<JobStatusUpdate, 'changedAt'>) => {
    const nextStatus = update.status;
    const changedAt = new Date().toISOString();

    setStatusMap((prev) => {
      const updated = { ...prev, [update.jobId]: nextStatus };
      try {
        localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });

    setStatusUpdates((prev) => {
      const nextUpdates = [{ ...update, changedAt }, ...prev].slice(0, MAX_UPDATES);
      try {
        localStorage.setItem(STATUS_UPDATES_STORAGE_KEY, JSON.stringify(nextUpdates));
      } catch {
        // Ignore localStorage errors
      }
      return nextUpdates;
    });
  }, []);

  return useMemo(() => ({
    isLoaded,
    getStatus,
    setJobStatus,
    statusUpdates,
  }), [getStatus, isLoaded, setJobStatus, statusUpdates]);
}
