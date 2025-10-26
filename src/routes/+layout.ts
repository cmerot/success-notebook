import { loadSettings } from '$lib/services/settings';
import { createDayFormSchema } from '$lib/schemas/day-form-schema';
import { createWeekFormSchema } from '$lib/schemas/week-form-schema';
import { createMonthFormSchema } from '$lib/schemas/month-form-schema';
import {
	createDayConfig,
	createWeekConfig,
	createMonthConfig
} from '$lib/components/notebook/config';
import type { LayoutLoad } from './$types';

// Tauri doesn't have a Node.js server to do proper SSR
// so we use adapter-static with a fallback to index.html to put the site in SPA mode
// See: https://svelte.dev/docs/kit/single-page-apps
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
	const settings = await loadSettings();

	return {
		url: url.pathname,
		settings,
		schemas: {
			day: createDayFormSchema(settings),
			week: createWeekFormSchema(settings),
			month: createMonthFormSchema(settings)
		},
		configs: {
			day: createDayConfig(settings),
			week: createWeekConfig(settings),
			month: createMonthConfig(settings)
		}
	};
};
