<script lang="ts">
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { useSectionFormFields } from '$lib/hooks/use-section-form-fields.svelte';
	import { dayConfig } from '$lib/components/notebook/config';
	import { FormStatus } from '$lib/components/form/status';
	import { formatDayLong, getDaySectionEditMode } from '$lib/utils-date';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import { EmoticonPicker } from '$lib/components/form/emoticon';
	import type { Snippet } from 'svelte';
	import Section from './section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isNew: boolean;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		isEditable?: boolean;
		footer?: Snippet;
	}

	let {
		data,
		bindToTime = false,
		isEditMode = $bindable(false),
		isEditable = $bindable(false),
		footer
	}: Props = $props();

	const form = useAutoSaveForm(data.day.form, {
		schema: dayFormSchema,
		onSave: (formData) => saveDayEntry(data.date, formData)
	});
	let { form: formData, enhance } = form;

	// Use the composable hook to manage all field state
	// $derived.by is necessary to re-call the hook when isEditMode changes
	const sections = $derived.by(() =>
		useSectionFormFields({
			sectionConfig: dayConfig.sections,
			isEditMode,
			bindToTime,
			date: data.date,
			getSectionEditMode: getDaySectionEditMode,
			formData: $formData,
			form
		})
	);
</script>

<form use:enhance>
	<Surface.Root class={dayConfig.theme}>
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<EmoticonPicker {form} name="start.mood.icon" class="inline" />
					<h2 class="text-2xl font-bold text-primary">{formatDayLong(data.date)}</h2>
					<FormStatus
						{form}
						class="ml-auto inline-block bg-transparent"
						bind:isEditMode
						{isEditable}
					/>
				</div>
			{/snippet}
		</Surface.Header>

		{#each sections as section}
			{#if section.showContent}
				<Section title={section.title} icon={section.icon} fields={section.fields} />
			{/if}
		{/each}

		{#if !sections.some((section) => section.showContent)}
			<div>
				<h3 class="text-lg font-semibold text-primary/50">{dayConfig.emptyState.title}</h3>
				<p class="text-muted-foreground">{dayConfig.emptyState.description}</p>
			</div>
		{/if}

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
