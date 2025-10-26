<script lang="ts" generics="T extends Record<string, any>">
	import type { CalendarDate } from '@internationalized/date';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import type { ZodType } from 'zod';
	import { getSectionStates } from '$lib/utils/form';
	import { debounce } from '$lib/utils/utils';
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
			config: FormConfig;
			schema: ZodType<T>;
		};
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
		emoticons?: Snippet<[{ form: ReturnType<typeof superForm<T>> }]>;
		footer?: Snippet;
	}

	let {
		data,
		onSave,
		formatTitle,
		getSectionEditMode,
		bindToTime = false,
		isEditMode = $bindable(false),
		emoticons,
		footer
	}: Props = $props();

	// Set up superForm with auto-save
	const form = superForm(data.form, {
		SPA: true,
		resetForm: false,
		// @ts-expect-error - Generic zod schema type is not fully compatible with zod4 validator
		validators: zod4(data.schema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				try {
					await onSave(form.data);
					// At this point submitting the form will
					// do nothing, except reproducing the behaviour
					// of a none js form, which is to reset focus
					cancel();
					tainted.set(undefined);
				} catch (error) {
					console.error('Error saving form:', error);
				}
			}
		}
	});

	let { form: formData, enhance, tainted } = form;

	// Create debounced auto-save function
	const autoSave = debounce(() => {
		// Only submit if form has actual user changes
		if (get(tainted)) {
			form.submit();
		}
	}, 1000);

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

	// Derive section states to manage all field state
	const { sections, hasContent, isEditable } = $derived(
		getSectionStates({
			sectionConfig: data.config.sections,
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
	<Surface.Root class={data.config.theme}>
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
				<h3 class="mb-2 text-lg font-semibold text-primary/50">{data.config.emptyState.title}</h3>
				<p class="text-muted-foreground">{data.config.emptyState.start}</p>
				<p class="text-muted-foreground">{data.config.emptyState.end}</p>
			</div>
		{/if}

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
