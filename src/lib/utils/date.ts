import {
	CalendarDate,
	DateFormatter,
	getLocalTimeZone,
	startOfWeek,
	endOfWeek,
	today as calendarDateToday,
	startOfMonth,
	endOfMonth
} from '@internationalized/date';

const locale = navigator.language;

export type BreakpointSize = 'numeric' | 'sm' | 'md' | 'lg';

export type FormatOptions = {
	size?: BreakpointSize;
};

const today = calendarDateToday(getLocalTimeZone());
export { today };

// Helper to normalize options
function normalizeOptions(options?: BreakpointSize | FormatOptions): { size: BreakpointSize } {
	if (typeof options === 'string') {
		return { size: options };
	}
	return { size: options?.size ?? 'sm' };
}

// New size-based formatters

export function formatDay(date: CalendarDate, options?: BreakpointSize | FormatOptions): string {
	const { size } = normalizeOptions(options);
	const jsDate = date.toDate(getLocalTimeZone());

	switch (size) {
		case 'numeric':
			// "21/10"
			return new DateFormatter(locale, {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric'
			}).format(jsDate);
		case 'sm':
			// "mardi 21 oct."
			return new DateFormatter(locale, {
				weekday: 'long',
				day: 'numeric',
				month: 'short'
			}).format(jsDate);
		case 'md':
		case 'lg':
			// "mardi 21 octobre"
			return new DateFormatter(locale, {
				weekday: 'long',
				day: 'numeric',
				month: 'long'
			}).format(jsDate);
	}
}

export function formatWeek(date: CalendarDate, options?: BreakpointSize | FormatOptions): string {
	const { size } = normalizeOptions(options);
	const start = startOfWeek(date, locale);
	const end = endOfWeek(date, locale);
	const startDate = start.toDate(getLocalTimeZone());
	const endDate = end.toDate(getLocalTimeZone());

	switch (size) {
		case 'numeric':
			// "20-26/10/2025"
			return (
				new DateFormatter(locale, { day: 'numeric' }).format(startDate) +
				'-' +
				new DateFormatter(locale, {
					day: 'numeric',
					month: 'numeric',
					year: 'numeric'
				}).format(endDate)
			);
		case 'sm':
			// "20-26 oct."
			return new DateFormatter(locale, {
				day: 'numeric',
				month: 'short'
			}).formatRange(startDate, endDate);
		case 'md':
			// "20-26 octobre"
			return new DateFormatter(locale, {
				day: 'numeric',
				month: 'long'
			}).formatRange(startDate, endDate);
		case 'lg':
			// "lundi 20 - dimanche 26 octobre"
			return new DateFormatter(locale, {
				weekday: 'long',
				day: 'numeric',
				month: 'long'
			}).formatRange(startDate, endDate);
	}
}

export function formatMonth(date: CalendarDate, options?: BreakpointSize | FormatOptions): string {
	const { size } = normalizeOptions(options);
	const jsDate = date.toDate(getLocalTimeZone());

	switch (size) {
		case 'numeric':
			// "10/2025"
			return new DateFormatter(locale, {
				month: 'numeric',
				year: 'numeric'
			}).format(jsDate);
		case 'sm':
			// "oct."
			return new DateFormatter(locale, {
				month: 'short'
			}).format(jsDate);
		case 'md':
		case 'lg':
			// "octobre"
			return new DateFormatter(locale, {
				month: 'long'
			}).format(jsDate);
	}
}

// Backward compatibility - keep "long" functions

export function formatDayLong(date: CalendarDate): string {
	return formatDay(date, 'lg');
}

export function formatWeekLong(date: CalendarDate): string {
	return formatWeek(date, 'lg');
}

// Function to determine if a section is editable based on time
export const getDaySectionEditMode = (
	isEditMode: boolean,
	bindToTime: boolean,
	date: CalendarDate,
	sectionName: string
): boolean => {
	if (!isEditMode) return false;
	if (!bindToTime) return isEditMode;

	// Time-based logic: turn on editing mode:
	// - for today
	// - depending on the hour
	const dateIsToday = today.compare(date) === 0;
	if (!dateIsToday) return false;

	const hour = new Date().getHours();
	const isStartOfDay = hour < 12;

	if (sectionName === 'start') return isStartOfDay;
	if (sectionName === 'end') return !isStartOfDay;

	return isEditMode;
};

// Function to determine if a section is editable based on time
export const getWeekSectionEditMode = (
	isEditMode: boolean,
	bindToTime: boolean,
	date: CalendarDate,
	sectionName: string
): boolean => {
	if (!isEditMode) return false;
	if (!bindToTime) return isEditMode;

	// Time-based logic: turn on editing mode:
	// - today is start of week
	// - today is end of week
	const dateIsToday = today.compare(date) === 0;
	if (!dateIsToday) return false;

	const dateIsStartOfWeek = startOfWeek(date, navigator.language).compare(date) === 0;
	const dateIsEndOfWeek = endOfWeek(date, navigator.language).compare(date) === 0;

	const hour = new Date().getHours();
	const isStartOfDay = hour < 12;

	if (sectionName === 'start') return dateIsStartOfWeek && isStartOfDay;
	if (sectionName === 'end') return dateIsEndOfWeek && !isStartOfDay;

	return isEditMode;
};

// Function to determine if a section is editable based on time
export const getMonthSectionEditMode = (
	isEditMode: boolean,
	bindToTime: boolean,
	date: CalendarDate,
	sectionName: string
): boolean => {
	if (!isEditMode) return false;
	if (!bindToTime) return isEditMode;
	// Time-based logic: turn on editing mode:
	// - today is start of week
	// - today is end of week
	const dateIsToday = today.compare(date) === 0;
	if (!dateIsToday) return false;

	const dateIsStartOfMonth = startOfMonth(date).compare(date) === 0;
	const dateIsEndOfMonth = endOfMonth(date).compare(date) === 0;

	if (sectionName === 'start') return dateIsStartOfMonth;
	if (sectionName === 'end') return dateIsEndOfMonth;

	return isEditMode;
};

// Types for hierarchical entries
export type HierarchicalDay = {
	date: CalendarDate;
	type: string;
};

export type HierarchicalWeek = {
	date: CalendarDate;
	hasEntry: boolean;
	days: HierarchicalDay[];
};

export type HierarchicalMonth = {
	date: CalendarDate;
	hasEntry: boolean;
	weeks: HierarchicalWeek[];
};

// Build hierarchical structure from flat entries list
export function buildHierarchicalEntries(
	entries: Array<{
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
	}>
): HierarchicalMonth[] {
	const months = new Map<
		string,
		{
			date: CalendarDate;
			hasEntry: boolean;
			weeks: Map<
				string,
				{
					date: CalendarDate;
					hasEntry: boolean;
					days: Array<{ date: CalendarDate; type: string }>;
				}
			>;
		}
	>();

	// Process all entries
	for (const entry of entries) {
		const monthStart = startOfMonth(entry.date);
		const monthKey = monthStart.toString();

		// Ensure month exists
		if (!months.has(monthKey)) {
			months.set(monthKey, {
				date: monthStart,
				hasEntry: false,
				weeks: new Map()
			});
		}
		const month = months.get(monthKey)!;

		// Mark if this is a month entry
		if (entry.type === 'month') {
			month.hasEntry = true;
		}

		// Only process week/day entries for weeks
		if (entry.type === 'week' || entry.type === 'day') {
			const weekStart = startOfWeek(entry.date, locale);
			const weekKey = weekStart.toString();

			// Ensure week exists
			if (!month.weeks.has(weekKey)) {
				month.weeks.set(weekKey, {
					date: weekStart,
					hasEntry: false,
					days: []
				});
			}
			const week = month.weeks.get(weekKey)!;

			// Mark if this is a week entry
			if (entry.type === 'week') {
				week.hasEntry = true;
			}

			// Add day entry
			if (entry.type === 'day') {
				week.days.push({ date: entry.date, type: entry.type });
			}
		}
	}

	// Sort months, weeks, and days by date (descending)
	const sortedMonths = Array.from(months.entries())
		.sort(([, a], [, b]) => b.date.compare(a.date))
		.map(([, month]) => {
			const sortedWeeks = Array.from(month.weeks.entries())
				.sort(([, a], [, b]) => b.date.compare(a.date))
				.map(([, week]) => ({
					...week,
					days: week.days.sort((a, b) => b.date.compare(a.date))
				}));
			return {
				...month,
				weeks: sortedWeeks
			};
		});

	return sortedMonths;
}
