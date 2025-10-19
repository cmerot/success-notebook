import {
	DateFormatter,
	type CalendarDate,
	getLocalTimeZone,
	startOfWeek,
	endOfWeek,
	today,
	startOfMonth,
	endOfMonth
} from '@internationalized/date';

const locale = navigator.language;

export function formatDayLong(date: CalendarDate): string {
	return new DateFormatter(locale, {
		dateStyle: 'full'
	}).format(date.toDate(getLocalTimeZone()));
}

export function formatDay(date: CalendarDate): string {
	return new DateFormatter(locale, {
		dateStyle: 'short'
	}).format(date.toDate(getLocalTimeZone()));
}

export function formatWeekLong(date: CalendarDate): string {
	const start = startOfWeek(date, locale);
	const end = endOfWeek(date, locale);

	return new DateFormatter(locale, {
		dateStyle: 'full'
	}).formatRange(start.toDate(getLocalTimeZone()), end.toDate(getLocalTimeZone()));
}

export function formatWeek(date: CalendarDate): string {
	const start = startOfWeek(date, locale);
	const end = endOfWeek(date, locale);

	return new DateFormatter(locale, {
		month: 'numeric',
		day: 'numeric'
	}).formatRange(start.toDate(getLocalTimeZone()), end.toDate(getLocalTimeZone()));
}

export function formatMonth(date: CalendarDate): string {
	return new DateFormatter(locale, {
		year: 'numeric',
		month: 'long'
	}).format(date.toDate(getLocalTimeZone()));
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
	const dateIsToday = today(getLocalTimeZone()).compare(date) === 0;
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
	const dateIsToday = today(getLocalTimeZone()).compare(date) === 0;
	if (!dateIsToday) return false;

	const dateIsStartOfWeek = startOfWeek(date, navigator.language).compare(date) === 0;
	const dateIsEndOfWeek = endOfWeek(date, navigator.language).compare(date) === 0;

	if (sectionName === 'start') return dateIsStartOfWeek;
	if (sectionName === 'end') return dateIsEndOfWeek;

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
	const dateIsToday = today(getLocalTimeZone()).compare(date) === 0;
	if (!dateIsToday) return false;

	const dateIsStartOfMonth = startOfMonth(date).compare(date) === 0;
	const dateIsEndOfMonth = endOfMonth(date).compare(date) === 0;

	if (sectionName === 'start') return dateIsStartOfMonth;
	if (sectionName === 'end') return dateIsEndOfMonth;

	return isEditMode;
};
