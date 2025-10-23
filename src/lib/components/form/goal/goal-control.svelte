<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import EditableTextBare from '$lib/components/form/text/editable-text-bare.svelte';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { cn } from '$lib/utils/utils';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import type { GoalItemSchemaType } from '$lib/schemas/common';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode: boolean;
		disableCompletion?: boolean;
		onBlur?: () => void;
	}

	let { form, name, isEditMode, disableCompletion = false, onBlur }: Props = $props();

	const goal = fieldProxy(form.form, name) as unknown as Writable<GoalItemSchemaType>;

	let popoverOpen = $state(false);
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
					inputClass="block flex-1"
					viewClass="block flex-1"
					emptyText=""
				/>
				<Popover.Root bind:open={popoverOpen}>
					<Popover.Trigger
						disabled={isEditMode ? disableCompletion || !$goal.text : disableCompletion}
						class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-[4rem]')}
					>
						{$goal.completion}%
					</Popover.Trigger>
					<Popover.Content side="top" align="center" class="w-auto">
						<Slider
							type="single"
							bind:value={$goal.completion}
							min={0}
							max={100}
							step={5}
							orientation="vertical"
							disabled={isEditMode ? disableCompletion || !$goal.text : disableCompletion}
							onValueCommit={() => {
								popoverOpen = false;
							}}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/snippet}
	</Form.Control>
{/if}
