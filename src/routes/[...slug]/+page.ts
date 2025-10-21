import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { CalendarDate, startOfMonth, startOfWeek } from '@internationalized/date';
import { zod4 } from 'sveltekit-superforms/adapters';
import { dayFormSchema, monthFormSchema, weekFormSchema } from '$lib/schemas';
import {
	isEntryEmpty,
	loadDayEntry,
	loadMonthEntry,
	loadWeekEntry
} from '$lib/stores/backend-store';
import { error } from '@sveltejs/kit';
import { today } from '$lib/utils-date';

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

	if (!slug && url.pathname !== '/') {
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

	const dayEntry = await loadDayEntry(date);
	const dayForm = await superValidate(dayEntry, zod4(dayFormSchema));

	const weekEntry = await loadWeekEntry(date);
	const weekForm = await superValidate(weekEntry, zod4(weekFormSchema));

	const monthEntry = await loadMonthEntry(date);
	const monthForm = await superValidate(monthEntry, zod4(monthFormSchema));

	return {
		date,
		period,
		day: { form: dayForm, isNew: isEntryEmpty(dayEntry) },
		week: { form: weekForm, isNew: isEntryEmpty(weekEntry) },
		month: { form: monthForm, isNew: isEntryEmpty(monthEntry) }
	};
};
