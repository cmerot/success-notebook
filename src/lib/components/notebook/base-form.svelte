<script lang="ts" generics="T extends Record<string, any>">
	import type { CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ZodType } from 'zod';
	import { superFormAutoSave, deriveSectionStates } from '$lib/utils/form.svelte';
	import { FormStatus } from '$lib/components/form/status';
	import * as Surface from '$lib/components/surface';
	import type { Snippet } from 'svelte';
	import type { FormConfig } from '$lib/types/form';
	import type { BreakpointSize, FormatOptions } from '$lib/utils/date';
	import Section from './section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<T>;
		};
		config: FormConfig;
		schema: ZodType<T>;
		onSave: (formData: T) => Promise<void>;
		formatTitle: (date: CalendarDate, options?: BreakpointSize | FormatOptions) => string;
		getSectionEditMode: (
			isEditMode: boolean,
			bindToTime: boolean,
			date: CalendarDate,
			sectionName: string
		) => boolean;
		bindToTime?: boolean;
		isEditMode?: boolean;
		emoticons?: Snippet<[{ form: ReturnType<typeof superFormAutoSave<T>> }]>;
		footer?: Snippet;
	}

	let {
		data,
		config,
		schema,
		onSave,
		formatTitle,
		getSectionEditMode,
		bindToTime = false,
		isEditMode = $bindable(false),
		emoticons,
		footer
	}: Props = $props();

	const form = superFormAutoSave(data.form, {
		schema,
		onSave
	});
	let { form: formData, enhance } = form;

	// Derive section states to manage all field state
	const { sections, hasContent, isEditable } = $derived(
		deriveSectionStates({
			sectionConfig: config.sections,
			isEditMode,
			bindToTime,
			date: data.date,
			getSectionEditMode,
			formData: $formData,
			form
		})
	);
</script>

<form use:enhance>
		<Surface.Root class={config.theme}>
			<Surface.Header>
				{#snippet title()}
					<div class="mb-6 flex items-center gap-x-2">
						{#if emoticons}
							{@render emoticons({ form })}
						{/if}
						<h2 class="mr-auto text-2xl font-bold text-primary">
							<span class="xs:hidden">{formatTitle(data.date)}</span>
							<span class="hidden xs:block">{formatTitle(data.date, 'md')}</span>
						</h2>
						<FormStatus {form} bind:isEditMode {isEditable} />
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

			{#if !hasContent}
				<div>
					<h3 class="mb-2 text-lg font-semibold text-primary/50">{config.emptyState.title}</h3>
					<p class="text-muted-foreground">{config.emptyState.start}</p>
					<p class="text-muted-foreground">{config.emptyState.end}</p>
				</div>
			{/if}

			{#if footer}
				<Surface.Footer>
					{@render footer()}
				</Surface.Footer>
			{/if}
		</Surface.Root>
</form>
