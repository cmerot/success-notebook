import { getAllEntries } from '$lib/services/entries';
import type { PageLoad } from './$types';
import { type PeriodType } from '$lib/utils/stats';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const allEntries = await getAllEntries();

	// Get period from URL params, default to current week
	const periodParam = (url.searchParams.get('period') as PeriodType) || 'month';
	const offset = parseInt(url.searchParams.get('offset') || '0');

	return {
		allEntries,
		period: periodParam,
		offset
	};
};
