import type { Job } from '../data/jobs';
import type { Preferences } from '../hooks/usePreferences';

export interface JobWithMatchScore extends Job {
  matchScore: number;
}

export function calculateMatchScore(job: Job, preferences: Preferences): number {
  let score = 0;

  // Parse user inputs
  const roleKeywords = preferences.roleKeywords
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0);
  
  const userSkills = preferences.skills
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);

  const jobTitle = job.title.toLowerCase();
  const jobDescription = job.description.toLowerCase();
  const jobSkills = job.skills.map(s => s.toLowerCase());

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (roleKeywords.length > 0) {
    const titleMatch = roleKeywords.some(keyword => jobTitle.includes(keyword));
    if (titleMatch) {
      score += 25;
    }
  }

  // +15 if any roleKeyword appears in job.description
  if (roleKeywords.length > 0) {
    const descriptionMatch = roleKeywords.some(keyword => jobDescription.includes(keyword));
    if (descriptionMatch) {
      score += 15;
    }
  }

  // +15 if job.location matches preferredLocations
  if (preferences.preferredLocations.length > 0) {
    if (preferences.preferredLocations.includes(job.location)) {
      score += 15;
    }
  }

  // +10 if job.mode matches preferredMode
  if (preferences.preferredMode.length > 0) {
    if (preferences.preferredMode.includes(job.mode)) {
      score += 10;
    }
  }

  // +10 if job.experience matches experienceLevel
  if (preferences.experienceLevel) {
    if (job.experience === preferences.experienceLevel) {
      score += 10;
    }
  }

  // +15 if overlap between job.skills and user.skills (any match)
  if (userSkills.length > 0) {
    const userSkillSet = new Set(userSkills);
    const skillOverlap = jobSkills.some(jobSkill => userSkillSet.has(jobSkill));
    if (skillOverlap) {
      score += 15;
    }
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === 'LinkedIn') {
    score += 5;
  }

  // Cap score at 100
  return Math.min(score, 100);
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'amber';
  if (score >= 40) return 'neutral';
  return 'grey';
}

export function getMatchScoreBadgeClass(score: number): string {
  const color = getMatchScoreColor(score);
  switch (color) {
    case 'green':
      return 'job-card__match-score--green';
    case 'amber':
      return 'job-card__match-score--amber';
    case 'neutral':
      return 'job-card__match-score--neutral';
    case 'grey':
    default:
      return 'job-card__match-score--grey';
  }
}
