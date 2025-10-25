import type { PageLoad } from './$types';
import { getAllEntries } from '$lib/stores/backend-store';

export const load: PageLoad = async () => {
	const entries = await getAllEntries();

	return { entries };
};
