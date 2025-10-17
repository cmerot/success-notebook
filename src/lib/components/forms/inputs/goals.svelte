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
	import { Button } from '$lib/components/ui/button';

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
		<div data-variant="edit">
			<Form.Control>
				{#snippet children({ props })}
					<div>
						<Input {...props} bind:value={goal.text} autocomplete="off" />
					</div>
				{/snippet}
			</Form.Control>
		</div>
		{#if goal.text}
			<div data-variant="view">
				<Form.Control>
					{#snippet children({ props })}
						<div>
							<p class="flex-1">{goal.text}</p>
						</div>
					{/snippet}
				</Form.Control>
			</div>
		{/if}
	{/each}
	{#if $value.every((goal) => !goal.text)}
		<div data-variant="view" class="-mt-4 text-muted-foreground"><p>...</p></div>
	{/if}
</Form.Fieldset>
