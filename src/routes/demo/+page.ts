import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { today, getLocalTimeZone } from '@internationalized/date';
import { zod4 } from 'sveltekit-superforms/adapters';
import { dayFormSchema, monthFormSchema, weekFormSchema } from '$lib/schemas';
import {
	isEntryEmpty,
	loadDayEntry,
	loadMonthEntry,
	loadWeekEntry
} from '$lib/stores/backend-store';

export const load: PageLoad = async () => {
	const date = today(getLocalTimeZone());

	const dayEntry = await loadDayEntry(date);
	const dayForm = await superValidate(dayEntry, zod4(dayFormSchema));

	const weekEntry = await loadWeekEntry(date);
	const weekForm = await superValidate(weekEntry, zod4(weekFormSchema));

	const monthEntry = await loadMonthEntry(date);
	const monthForm = await superValidate(monthEntry, zod4(monthFormSchema));

	return {
		date,
		day: { entry: dayEntry, form: dayForm, isNew: isEntryEmpty(dayEntry) },
		week: { entry: weekEntry, form: weekForm, isNew: isEntryEmpty(weekEntry) },
		month: { entry: monthEntry, form: monthForm, isNew: isEntryEmpty(monthEntry) }
	};
};
