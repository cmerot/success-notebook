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

	type InferredType = z.infer<T>;
	type Routine = {
		text: string;
		monday: boolean;
		tuesday: boolean;
		wednesday: boolean;
		thursday: boolean;
		friday: boolean;
		saturday: boolean;
		sunday: boolean;
	};

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		legend: string;
	}

	let { form, formData, name, legend }: Props = $props();

	const defaultRoutine = () => ({
		text: '',
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
		sunday: false
	});
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<Routine[]>);
	$value = fillArray($value, defaultRoutine, 4);
</script>

<Form.Fieldset {form} {name} data-container>
	<div class="flex items-center gap-x-3">
		<Form.Legend class="flex-1">{legend}</Form.Legend>
		<span class="w-5">L</span>
		<span class="w-5">M</span>
		<span class="w-5">M</span>
		<span class="w-5">J</span>
		<span class="w-5">V</span>
		<span class="w-5">S</span>
		<span class="w-5">D</span>
	</div>
	{#each $value as routine, i (i)}
		<div data-variant="edit">
			<Form.Control>
				{#snippet children({ props })}
					<div>
						<div class="flex items-center gap-x-3">
							<Input {...props} bind:value={routine.text} autocomplete="off" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
							<Check class="size-9 text-primary/40" />
						</div>
					</div>
				{/snippet}
			</Form.Control>
		</div>
		{#if routine.text}
			<div data-variant="view">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center gap-x-3">
							<p class="flex-1">{routine.text}</p>
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.monday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.tuesday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.wednesday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.thursday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.friday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.saturday} />
							<Checkbox class="h-5 w-5" {...props} bind:checked={routine.sunday} />
						</div>
					{/snippet}
				</Form.Control>
			</div>
		{/if}
	{/each}
</Form.Fieldset>
