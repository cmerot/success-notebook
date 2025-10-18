import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { CalendarDate } from '@internationalized/date';
import { zod4 } from 'sveltekit-superforms/adapters';
import { dayFormSchema, monthFormSchema, weekFormSchema } from '$lib/schemas';
import {
	isEntryEmpty,
	loadDayEntry,
	loadMonthEntry,
	loadWeekEntry
} from '$lib/stores/backend-store';

export const load: PageLoad = async ({ params }) => {
	const [year, month, day, period] = params.slug.split('/');
	const date = new CalendarDate(Number(year), Number(month), Number(day));

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
