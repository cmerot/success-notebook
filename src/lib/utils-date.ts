import {
	DateFormatter,
	type CalendarDate,
	getLocalTimeZone,
	startOfWeek,
	endOfWeek
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
