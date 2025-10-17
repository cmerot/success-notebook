import { loadDayEntry, loadWeekEntry, loadMonthEntry } from '$lib/stores/backend-store';
import { today, getLocalTimeZone } from '@internationalized/date';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const date = today(getLocalTimeZone());
	const dayEntry = await loadDayEntry(date);
	const weekEntry = await loadWeekEntry(date);
	const monthEntry = await loadMonthEntry(date);

	return {
		date,
		dayEntry,
		weekEntry,
		monthEntry
	};
};
