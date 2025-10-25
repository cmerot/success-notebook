import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { CalendarDate, startOfMonth, startOfWeek } from '@internationalized/date';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getDayFormSchema, getMonthFormSchema, getWeekFormSchema } from '$lib/schemas';
import { loadDayEntry, loadMonthEntry, loadWeekEntry } from '$lib/stores/backend-store';
import { hasContent } from '$lib/utils/utils';
import { error } from '@sveltejs/kit';
import {
	getDaySectionEditMode,
	getMonthSectionEditMode,
	getWeekSectionEditMode,
	today
} from '$lib/utils/date';
import { resolve } from '$app/paths';

interface Slug {
	year: number;
	month: number;
	day: number;
	period?: 'day' | 'week' | 'month';
}

function parseSlug(path: string): Slug | null {
	const segments = path.split('/'); // ['2021', '12', '12', 'day']
	if (segments.length < 3 || segments.length > 4) return null;

	const [yearStr, monthStr, dayStr, periodStr] = segments;
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);

	if (
		isNaN(year) ||
		isNaN(month) ||
		isNaN(day) ||
		(periodStr && !['day', 'week', 'month'].includes(periodStr))
	) {
		return null;
	}

	const slug: Slug = {
		year,
		month,
		day,
		...(periodStr ? { period: periodStr as Slug['period'] } : {})
	};

	return slug;
}

export const load: PageLoad = async ({ params, url }) => {
	const slug = parseSlug(params.slug);

	if (!slug && url.pathname !== resolve('/')) {
		throw error(404, 'Pas une date !');
	}
	const date = slug ? new CalendarDate(slug.year, slug.month, slug.day) : today;

	//
	// Avoid multiple URLs serving same content
	//

	const isStartOfWeek = date.compare(startOfWeek(date, navigator.language)) === 0;
	const isStartOfMonth = date.compare(startOfMonth(date)) === 0;

	let period = null;

	if (slug) {
		if (slug.period == 'week' && !isStartOfWeek) {
			throw error(404, 'Pas le premier jour de la semaine !');
		}
		if (slug.period == 'month' && !isStartOfMonth) {
			throw error(404, 'Pas le premier jour du mois !');
		}
		period = slug.period;
	}

	//
	// Data management
	//

	const firstDayOfWeek = startOfWeek(date, navigator.language);
	const firstDayOfMonth = startOfMonth(date);
	const dayHref = resolve(`/${date.year}/${date.month}/${date.day}/day`);
	const weekHref = resolve(
		`/${firstDayOfWeek.year}/${firstDayOfWeek.month}/${firstDayOfWeek.day}/week`
	);
	const monthHref = resolve(
		`/${firstDayOfMonth.year}/${firstDayOfMonth.month}/${firstDayOfMonth.day}/month`
	);

	const dayEntry = await loadDayEntry(date);
	const dayForm = await superValidate(dayEntry, zod4(getDayFormSchema()));
	// const dayUrl =

	const weekEntry = await loadWeekEntry(date);
	const weekForm = await superValidate(weekEntry, zod4(getWeekFormSchema()));

	const monthEntry = await loadMonthEntry(date);
	const monthForm = await superValidate(monthEntry, zod4(getMonthFormSchema()));

	// If the entry is new, or at least one section
	// is in the time window of editing, return true
	const dayIsEditMode =
		!hasContent(dayEntry) ||
		(!hasContent(dayEntry?.start) && getDaySectionEditMode(true, true, date, 'start')) ||
		(!hasContent(dayEntry?.end) && getDaySectionEditMode(true, true, date, 'end'));

	const weekIsEditMode =
		!hasContent(monthEntry) ||
		(!hasContent(weekEntry?.start) && getWeekSectionEditMode(true, true, date, 'start')) ||
		(!hasContent(weekEntry?.end) && getWeekSectionEditMode(true, true, date, 'end'));

	const monthIsEditMode =
		!hasContent(monthEntry) ||
		(!hasContent(monthEntry?.start) && getMonthSectionEditMode(true, true, date, 'start')) ||
		(!hasContent(monthEntry?.end) && getMonthSectionEditMode(true, true, date, 'end'));

	return {
		date,
		period,
		day: { form: dayForm, isEditMode: dayIsEditMode, url: dayHref },
		week: { form: weekForm, isEditMode: weekIsEditMode, url: weekHref },
		month: { form: monthForm, isEditMode: monthIsEditMode, url: monthHref }
	};
};
