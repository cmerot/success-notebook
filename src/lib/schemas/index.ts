import { loadSettings, DEFAULT_SETTINGS } from '$lib/services/settings';
import { createDayFormSchema } from './day-form-schema';
import { createWeekFormSchema } from './week-form-schema';
import { createMonthFormSchema } from './month-form-schema';
import {
	createDayConfig,
	createWeekConfig,
	createMonthConfig
} from '$lib/components/notebook/config';

// Schémas et configs initialisés au chargement de l'app
let dayFormSchema: ReturnType<typeof createDayFormSchema>;
let weekFormSchema: ReturnType<typeof createWeekFormSchema>;
let monthFormSchema: ReturnType<typeof createMonthFormSchema>;

let dayConfig: ReturnType<typeof createDayConfig>;
let weekConfig: ReturnType<typeof createWeekConfig>;
let monthConfig: ReturnType<typeof createMonthConfig>;

let initialized = false;

export async function initSchemas() {
	if (!initialized) {
		const settings = await loadSettings();
		dayFormSchema = createDayFormSchema(settings);
		weekFormSchema = createWeekFormSchema(settings);
		monthFormSchema = createMonthFormSchema(settings);
		dayConfig = createDayConfig(settings);
		weekConfig = createWeekConfig(settings);
		monthConfig = createMonthConfig(settings);
		initialized = true;
	}
}

// Getters pour accéder aux schémas (avec fallback)
export function getDayFormSchema() {
	if (!initialized) {
		return createDayFormSchema(DEFAULT_SETTINGS);
	}
	return dayFormSchema;
}

export function getWeekFormSchema() {
	if (!initialized) {
		return createWeekFormSchema(DEFAULT_SETTINGS);
	}
	return weekFormSchema;
}

export function getMonthFormSchema() {
	if (!initialized) {
		return createMonthFormSchema(DEFAULT_SETTINGS);
	}
	return monthFormSchema;
}

// Getters pour accéder aux configs (avec fallback)
export function getDayConfig() {
	if (!initialized) {
		return createDayConfig(DEFAULT_SETTINGS);
	}
	return dayConfig;
}

export function getWeekConfig() {
	if (!initialized) {
		return createWeekConfig(DEFAULT_SETTINGS);
	}
	return weekConfig;
}

export function getMonthConfig() {
	if (!initialized) {
		return createMonthConfig(DEFAULT_SETTINGS);
	}
	return monthConfig;
}

// Re-exports des types et schémas individuels
export * from './day-form-schema';
export * from './week-form-schema';
export * from './month-form-schema';
export * from './common';
