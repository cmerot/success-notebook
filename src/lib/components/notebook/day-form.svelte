<script lang="ts">
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { useSectionFormFields } from '$lib/hooks/use-section-form-fields.svelte';
	import { dayConfig } from '$lib/components/notebook/config';
	import { FormStatus } from '$lib/components/form/status';
	import { formatDay, getDaySectionEditMode } from '$lib/utils-date';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import type { Snippet } from 'svelte';
	import Section from './section.svelte';
	import { EmoticonsField } from '$lib/components/form/emoticon';

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
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();

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
					<EmoticonsField {form} startName="start.mood.icon" endName="end.mood.icon" size="md" />
					<h2 class="mr-auto text-2xl font-bold text-primary">
						<span class="xs:hidden">{formatDay(data.date)}</span>
						<span class="hidden xs:block">{formatDay(data.date, 'md')}</span>
					</h2>
					<FormStatus
						{form}
						bind:isEditMode
						isEditable={sections.some((section) => section.isEditable)}
					/>
				</div>
			{/snippet}
		</Surface.Header>

		<div class="space-y-12">
			{#each sections as section}
				{#if section.showContent}
					<Section title={section.title} icon={section.icon} fields={section.fields} />
				{/if}
			{/each}
		</div>

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
