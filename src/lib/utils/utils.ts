import { clsx, type ClassValue } from 'clsx';
import type { Snippet } from 'svelte';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns The debounced function with a cancel method
 */
export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const debounced = function (...args: Parameters<T>) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			timeoutId = undefined;
			func(...args);
		}, wait);
	};

	debounced.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
		}
	};

	return debounced;
}

// Type for values that can be checked for content
export type HasContentValue =
	| string
	| number
	| boolean
	| unknown[]
	| Record<string, unknown>
	| null
	| undefined;

// Helper function to check if a field has content
export const hasContent = (value: HasContentValue): boolean => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.trim().length > 0;
	if (typeof value === 'number' || typeof value === 'boolean') return false;
	if (Array.isArray(value))
		return value.length > 0 && value.some((item) => hasContent(item as HasContentValue));
	if (typeof value === 'object') {
		// Check if any property in the object has content
		return Object.values(value).some((val) => hasContent(val as HasContentValue));
	}
	return false;
};

// Helper function to check if value is a snippet
export function isSnippet(value: unknown): value is Snippet {
	return typeof value === 'function';
}
