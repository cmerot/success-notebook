import { hasContent } from '$lib/utils/utils';
import type { CalendarDate } from '@internationalized/date';
import type { FieldConfig, SectionConfig, FieldState, SectionState } from '$lib/types/form';
import type { SuperForm } from 'sveltekit-superforms';

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

export function getSectionStates<T extends Record<string, unknown>>(
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

	// Create section states (pure function - reactivity handled by caller)
	const sections = Object.entries(sectionConfig).map(([sectionName, section]): SectionState => {
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
	});

	// Compute aggregate values once instead of multiple iterations
	const anyContent = sections.some((section) => section.showContent);
	const anyEditable = sections.some((section) => section.isEditable);

	return { sections, hasContent: anyContent, isEditable: anyEditable };
}
