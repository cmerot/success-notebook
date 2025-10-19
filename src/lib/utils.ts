import { clsx, type ClassValue } from 'clsx';
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

export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return function (...args: Parameters<T>) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

export function fillArray<T>(source: T[], seed: () => T, length: number): T[] {
	const filled = [...source];
	while (filled.length < length) {
		filled.push(seed());
	}
	return filled;
}

export const toggleSection = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	const section = target.closest('[data-section]') as HTMLElement;
	if (!section) return;

	const currentMode = section.getAttribute('data-edit-mode');
	const newMode = currentMode === 'edit' ? 'view' : 'edit';
	section.setAttribute('data-edit-mode', newMode);
};

// Helper function to check if a field has content
export const hasContent = (value: unknown): boolean => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0 && value.some((item) => hasContent(item));
	if (typeof value === 'object') {
		// Check if any property in the object has content
		return Object.values(value as Record<string, unknown>).some((val) => hasContent(val));
	}
	return false;
};
