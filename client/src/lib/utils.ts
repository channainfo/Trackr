import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency = 'USD'): string {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCryptoAmount(amount: number | string, symbol: string): string {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  
  // Format with appropriate precision based on crypto type
  let precision = 8; // Default for most cryptos
  
  if (symbol === 'BTC') {
    precision = 8;
  } else if (symbol === 'ETH') {
    precision = 6;
  } else if (['ADA', 'XRP', 'DOT'].includes(symbol)) {
    precision = 4;
  }
  
  return `${parseFloat(amount.toFixed(precision))} ${symbol}`;
}

export function formatPercentage(value: number): string {
  return `${(value > 0 ? '+' : '')}${(value * 100).toFixed(2)}%`;
}

export function calculatePercentageChange(currentValue: number, previousValue: number): number {
  if (previousValue === 0) return 0;
  return (currentValue - previousValue) / previousValue;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.substring(0, maxLength)}...`;
}
