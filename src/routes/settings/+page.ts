import { loadSettings } from '$lib/services/settings';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const settings = await loadSettings();
	return {
		settings
	};
};
