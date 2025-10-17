<script lang="ts" generics="T extends z.ZodObject<any>">
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Check from '@lucide/svelte/icons/check';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { SuperFormData, FormPath } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import type { FsSuperForm } from 'formsnap';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import type { Writable } from 'svelte/store';
	import { fillArray } from '$lib/utils';
	import { Percent } from 'lucide-svelte';

	type InferredType = z.infer<T>;
	type Goal = { text: string; completion: number };

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		legend: string;
	}

	let { form, formData, name, legend }: Props = $props();

	const defaultGoal = () => ({ text: '', completion: 0 });
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<Goal[]>);
	$value = fillArray($value, defaultGoal, 3);
</script>

<Form.Fieldset {form} {name} data-container>
	<Form.Legend>{legend}</Form.Legend>
	{#each $value as goal, i (i)}
		{#if goal.text}
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center">
						<p class="flex-1">{goal.text}</p>
						<input
							{...props}
							type="range"
							min="0"
							max="100"
							bind:value={goal.completion}
							class="ml-3 w-20"
						/>
					</div>
				{/snippet}
			</Form.Control>
		{/if}
	{/each}
</Form.Fieldset>
