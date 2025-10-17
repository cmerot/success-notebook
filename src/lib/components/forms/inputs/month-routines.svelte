<script lang="ts" generics="T extends z.ZodObject<any>">
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { SuperFormData, FormPath } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import type { FsSuperForm } from 'formsnap';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import type { Writable } from 'svelte/store';
	import { fillArray } from '$lib/utils';

	type InferredType = z.infer<T>;
	type Routine = string;

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		legend: string;
	}

	let { form, formData, name, legend }: Props = $props();

	const defaultRoutine = () => '';
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<Routine[]>);
	$value = fillArray($value, defaultRoutine, 5);
</script>

<Form.Fieldset {form} {name} data-container>
	<div class="flex items-center gap-x-3">
		<Form.Legend class="flex-1">{legend}</Form.Legend>
	</div>
	{#each $value as routine, i (i)}
		<div data-variant="edit">
			<Form.Control>
				{#snippet children({ props })}
					<div>
						<div class="flex items-center gap-x-3">
							<Input {...props} bind:value={$value[i]} autocomplete="off" />
						</div>
					</div>
				{/snippet}
			</Form.Control>
		</div>
		{#if routine}
			<div data-variant="view">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center gap-x-3">
							<p class="flex-1">{routine}</p>
						</div>
					{/snippet}
				</Form.Control>
			</div>
		{/if}
	{/each}
</Form.Fieldset>
