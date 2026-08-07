import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatCountdown(expiresAtIso: string): { formatted: string; percentage: number; isExpired: boolean } {
  const expires = new Date(expiresAtIso).getTime();
  const now = Date.now();
  const remainingMs = expires - now;

  if (remainingMs <= 0) {
    return { formatted: 'Expired', percentage: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Assuming initial duration of 15 mins (900s) for percentage bar calculation
  const percentage = Math.min(100, Math.max(0, (totalSeconds / 900) * 100));

  return { formatted, percentage, isExpired: false };
}
