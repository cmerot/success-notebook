<script lang="ts">
	import { monthFormSchema, type MonthFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { useSectionFormFields } from '$lib/hooks/use-section-form-fields.svelte';
	import { monthConfig } from '$lib/components/notebook/config';
	import { FormStatus } from '$lib/components/form/status';
	import { formatMonth, getMonthSectionEditMode } from '$lib/utils-date';
	import { saveMonthEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import type { Snippet } from 'svelte';
	import Section from './section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			month: {
				form: SuperValidated<MonthFormType>;
				isNew: boolean;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();

	const form = useAutoSaveForm(data.month.form, {
		schema: monthFormSchema,
		onSave: (formData) => saveMonthEntry(data.date, formData)
	});
	let { form: formData, enhance } = form;

	// Use the composable hook to manage all field state
	const sections = $derived.by(() =>
		useSectionFormFields({
			sectionConfig: monthConfig.sections,
			isEditMode,
			bindToTime,
			date: data.date,
			getSectionEditMode: getMonthSectionEditMode,
			formData: $formData,
			form
		})
	);
</script>

<form use:enhance>
	<Surface.Root class={monthConfig.theme}>
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<span
						class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-input bg-background text-4xl"
						>{monthConfig.emoji}</span
					>
					<h2 class="text-2xl font-bold text-primary">{formatMonth(data.date, 'md')}</h2>
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
				<h3 class="text-lg font-semibold text-primary/50">{monthConfig.emptyState.title}</h3>
				<p class="text-muted-foreground">{monthConfig.emptyState.description}</p>
			</div>
		{/if}

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
