<script lang="ts">
	import { weekFormSchema, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { useSectionFormFields } from '$lib/hooks/use-section-form-fields.svelte';
	import { weekConfig } from '$lib/components/notebook/config';
	import { FormStatus } from '$lib/components/form/status';
	import { formatWeek, getWeekSectionEditMode } from '$lib/utils-date';
	import { saveWeekEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import type { Snippet } from 'svelte';
	import Section from './section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			week: {
				form: SuperValidated<WeekFormType>;
				isNew: boolean;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();

	const form = useAutoSaveForm(data.week.form, {
		schema: weekFormSchema,
		onSave: (formData) => saveWeekEntry(data.date, formData)
	});
	let { form: formData, enhance } = form;

	// Use the composable hook to manage all field state
	const sections = $derived.by(() =>
		useSectionFormFields({
			sectionConfig: weekConfig.sections,
			isEditMode,
			bindToTime,
			date: data.date,
			getSectionEditMode: getWeekSectionEditMode,
			formData: $formData,
			form
		})
	);
</script>

<form use:enhance>
	<Surface.Root class={weekConfig.theme}>
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<span
						class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-input bg-background text-4xl"
						>{weekConfig.emoji}</span
					>
					<h2 class="text-2xl font-bold text-primary">
						<span class="xs:hidden">{formatWeek(data.date)}</span>
						<span class="hidden xs:block">{formatWeek(data.date, 'md')}</span>
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
				<h3 class="text-lg font-semibold text-primary/50">{weekConfig.emptyState.title}</h3>
				<p class="text-muted-foreground">{weekConfig.emptyState.description}</p>
			</div>
		{/if}

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
