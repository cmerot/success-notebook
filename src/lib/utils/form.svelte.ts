import { superForm, type SuperValidated, type SuperForm } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { get } from 'svelte/store';
import { debounce, hasContent } from '$lib/utils/utils';
import type { z } from 'zod';
import type { CalendarDate } from '@internationalized/date';
import type { FieldConfig, SectionConfig, FieldState, SectionState } from '$lib/types/form';

interface SuperFormAutoSaveOptions<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: z.ZodType<any, any, any>;
	onSave: (data: T) => Promise<void>;
	debounceMs?: number;
	onError?: (error: unknown) => void;
}

export function superFormAutoSave<T extends Record<string, unknown>>(
	data: SuperValidated<T>,
	options: SuperFormAutoSaveOptions<T>
) {
	const form = superForm(data, {
		SPA: true,
		resetForm: false,
		validators: zod4(options.schema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				try {
					await options.onSave(form.data);
					// At this point submitting the form will
					// do nothing, except mess with the focus
					// which does not play well with auto-save
					cancel();
					tainted.set(undefined);
				} catch (error) {
					console.error('Error saving form:', error);
					options.onError?.(error);
				}
			}
		}
	});

	const { form: formData, tainted } = form;

	// Create debounced auto-save function
	const autoSave = debounce(() => {
		// Only submit if form has actual user changes
		if (get(tainted)) {
			form.submit();
		}
	}, options.debounceMs ?? 1000);

	// Track form data changes and trigger auto-save
	$effect(() => {
		// Subscribe to formData changes
		const unsubscribe = formData.subscribe(() => {
			autoSave();
		});

		// Cleanup: unsubscribe and cancel pending debounced calls
		return () => {
			unsubscribe();
			autoSave.cancel?.();
		};
	});

	return form;
}

//
// Section States
//

interface SectionStatesOptions<T extends Record<string, unknown>> {
	sectionConfig: SectionConfig;
	isEditMode: boolean;
	bindToTime?: boolean;
	date?: CalendarDate;
	getSectionEditMode?: (
		isEditMode: boolean,
		bindToTime: boolean,
		date: CalendarDate,
		sectionName: string
	) => boolean;
	formData: T;
	form: SuperForm<T>;
}

// Helper to get nested value from form data (pure function, not reactive)
function getFieldValue<T extends Record<string, unknown>>(formData: T, path: string): unknown {
	const parts = path.split('.');
	let value: unknown = formData;
	for (const part of parts) {
		value = (value as Record<string, unknown>)?.[part];
	}
	return value;
}

// Build props for a field (pure function, not reactive)
function buildFieldProps<T extends Record<string, unknown>>(
	config: FieldConfig,
	form: SuperForm<T>,
	isEditMode: boolean
): Record<string, unknown> {
	const props: Record<string, unknown> = {
		form,
		name: config.path,
		isEditMode
	};

	if (config.label) props.label = config.label;
	if (config.legend) props.legend = config.legend;
	if (config.maxItems) props.maxItems = config.maxItems;

	return props;
}

export function deriveSectionStates<T extends Record<string, unknown>>(
	options: SectionStatesOptions<T>
) {
	const {
		sectionConfig,
		isEditMode,
		bindToTime = false,
		date,
		getSectionEditMode,
		formData,
		form
	} = options;

	// Create section states (REACTIVE: depends on formData and isEditMode)
	const sections = $derived(
		Object.entries(sectionConfig).map(([sectionName, section]): SectionState => {
			// Compute if section WOULD be editable (isEditMode=true scenario)
			const sectionIsEditable =
				getSectionEditMode && date ? getSectionEditMode(true, bindToTime, date, sectionName) : true;

			// Compute actual current edit mode
			const sectionIsEditMode =
				getSectionEditMode && date
					? getSectionEditMode(isEditMode, bindToTime, date, sectionName)
					: isEditMode;

			const fields = section.fields.map((config): FieldState => {
				const value = getFieldValue(formData, config.path);
				const fieldHasContent = hasContent(value);
				const fieldShouldShow = fieldHasContent || sectionIsEditMode;

				return {
					config,
					sectionName,
					hasContent: fieldHasContent,
					isEditMode: sectionIsEditMode,
					shouldShow: fieldShouldShow,
					props: buildFieldProps(config, form, sectionIsEditMode)
				};
			});

			return {
				name: sectionName,
				title: section.title,
				icon: section.icon,
				fields,
				showContent: fields.some((f) => f.shouldShow),
				isEditable: sectionIsEditable
			};
		})
	);

	// Compute aggregate values once instead of multiple iterations
	const anyContent = $derived(sections.some((section) => section.showContent));
	const anyEditable = $derived(sections.some((section) => section.isEditable));

	return { sections, hasContent: anyContent, isEditable: anyEditable };
}
