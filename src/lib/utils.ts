import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard Tailwind merging helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Maps business categories to display labels
const categoryLabels: Record<string, string> = {
  restaurant: 'Restaurant',
  retail: 'Retail Shop',
  salon: 'Salon & Beauty',
  clinic: 'Clinic / Medical',
  auto_service: 'Auto Service',
  bakery: 'Bakery',
  pharmacy: 'Pharmacy',
  tailor: 'Tailor Shop',
  cafe: 'Café',
  gym: 'Gym & Fitness',
  electronics: 'Electronics',
  jewellery: 'Jewellery',
  real_estate: 'Real Estate',
  catering: 'Catering',
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category || 'Business';
}

// Returns hex color strings for score colors
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // Emerald/Green
  if (score >= 50) return '#f59e0b'; // Amber/Yellow
  return '#ef4444'; // Red
}

// Returns CSS classes for score badges (includes bg, text, and border colors)
export function getScoreBg(score: number): string {
  if (score >= 80) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50';
  }
  if (score >= 50) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50';
  }
  return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50';
}

// Maps pipeline stages to readable labels
export function getPipelineLabel(stage: string): string {
  switch (stage) {
    case 'discovery':
      return 'Discovery';
    case 'qualified':
      return 'Qualified';
    case 'contacted':
      return 'Contacted';
    case 'client':
      return 'Client';
    default:
      return stage;
  }
}

// Formats dates to a standard readable string (e.g. Jul 19, 2026)
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}
