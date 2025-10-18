<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import EditableTextBare from '$lib/components/form/text/editable-text-bare.svelte';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { cn } from '$lib/utils';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import type { GoalItemSchemaType } from '$lib/schemas/common';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode: boolean;
		disableCompletion?: boolean;
		onBlur?: () => void;
	}

	let { form, name, isEditMode, disableCompletion = false, onBlur }: Props = $props();

	const goal = fieldProxy(form.form, name) as unknown as Writable<GoalItemSchemaType>;
</script>

{#if isEditMode || $goal.text}
	<Form.Control>
		{#snippet children({ props })}
			<div
				class={cn('flex items-center gap-3 rounded-lg px-3 py-2', {
					'transition-colors hover:bg-accent': isEditMode
				})}
			>
				<EditableTextBare
					{isEditMode}
					bind:value={$goal.text}
					placeholder="Nouvel objectif..."
					{onBlur}
					formProps={isEditMode ? props : {}}
					inputClass="block min-h-[1.25rem] w-0 flex-1"
					viewClass="block min-h-[1.25rem] w-0 flex-1 text-left text-foreground"
					emptyText=""
				/>
				<div class={cn('shrink-0', isEditMode ? 'relative w-24 grow-0' : 'max-w-24 min-w-24')}>
					<Slider
						type="single"
						bind:value={$goal.completion}
						min={0}
						max={100}
						step={5}
						disabled={isEditMode ? disableCompletion || !$goal.text : disableCompletion}
					/>
				</div>
				<span class="min-w-[3ch] text-right text-sm text-muted-foreground">
					{$goal.completion}%
				</span>
			</div>
		{/snippet}
	</Form.Control>
{/if}
