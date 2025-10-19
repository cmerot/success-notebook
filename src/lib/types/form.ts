import type { Component } from 'lucide-svelte';

export interface FieldConfig {
	name: string;
	path: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: any;
	label?: string;
	legend?: string;
	maxItems?: number;
}

export interface SectionConfig {
	[key: string]: {
		title: string;
		icon: typeof Component;
		fields: FieldConfig[];
	};
}

export interface FieldState {
	config: FieldConfig;
	sectionName: string;
	hasContent: boolean;
	isEditMode: boolean;
	shouldShow: boolean;
	props: Record<string, unknown>;
}

export interface SectionState {
	name: string;
	title: string;
	icon: typeof Component;
	fields: FieldState[];
	showContent: boolean;
}

export interface FormConfig {
	theme: string;
	emoji: string;
	sections: SectionConfig;
	emptyState: {
		title: string;
		description: string;
	};
}
