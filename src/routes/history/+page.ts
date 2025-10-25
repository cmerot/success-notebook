import type { PageLoad } from './$types';
import { getAllEntries } from '$lib/services/entries';

export const load: PageLoad = async () => {
	const entries = await getAllEntries();

	return { entries };
};
