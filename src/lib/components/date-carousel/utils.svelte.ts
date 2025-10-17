import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';
import { loadDayEntry, loadWeekEntry, loadMonthEntry } from '$lib/stores/backend-store';
import { CalendarDate, today, getLocalTimeZone, startOfWeek } from '@internationalized/date';

export type DayData = {
	date: CalendarDate;
	formData?: DayFormType;
};

export type WeekData = {
	date: CalendarDate;
	formData?: WeekFormType;
};

export type MonthData = {
	date: CalendarDate;
	formData?: MonthFormType;
};

const baseDate = $state(today(getLocalTimeZone()));
const locale = navigator.language;

export function getDayData(offset: number): DayData {
	const date = baseDate.add({ days: offset });
	const initialData: DayData = { date, formData: undefined };
	(async () => {
		const existingEntry = await loadDayEntry(date);
		if (existingEntry) {
			initialData.formData = existingEntry;
		}
	})();
	return initialData;
}

export function getWeekData(offset: number): WeekData {
	const date = baseDate.add({ weeks: offset });
	const initialData: WeekData = { date, formData: undefined };
	(async () => {
		const existingEntry = await loadWeekEntry(date);
		if (existingEntry) {
			initialData.formData = existingEntry;
		}
	})();
	return initialData;
}

export function getMonthData(offset: number): MonthData {
	const date = baseDate.add({ months: offset });
	const initialData: MonthData = { date, formData: undefined };
	(async () => {
		const existingEntry = await loadMonthEntry(date);
		if (existingEntry) {
			initialData.formData = existingEntry;
		}
	})();
	return initialData;
}

export function getDayOffset(baseDate: CalendarDate, targetDate: CalendarDate): number {
	return targetDate.compare(baseDate);
}

export function getWeekOffset(baseDate: CalendarDate, targetDate: CalendarDate): number {
	const baseWeekStart = startOfWeek(baseDate, locale);
	const targetWeekStart = startOfWeek(targetDate, locale);
	return targetWeekStart.compare(baseWeekStart) / 7;
}

export function getMonthOffset(baseDate: CalendarDate, targetDate: CalendarDate): number {
	return (targetDate.year - baseDate.year) * 12 + (targetDate.month - baseDate.month);
}
