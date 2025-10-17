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
	type Todo = { text: string; completed: boolean };

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		legend: string;
	}

	let { form, formData, name, legend }: Props = $props();

	const defaultTodo = () => ({ text: '', completed: false });
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<Todo[]>);
	$value = fillArray($value, defaultTodo, 3);
</script>

<Form.Fieldset {form} {name} data-container>
	<Form.Legend>{legend}</Form.Legend>
	{#each $value as todo, i (i)}
		<div data-variant="edit">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center">
						<Check class="mr-3 text-primary" />
						<Input {...props} bind:value={todo.text} autocomplete="off" />
					</div>
				{/snippet}
			</Form.Control>
		</div>
		{#if todo.text}
			<div data-variant="view">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center">
							<Checkbox {...props} bind:checked={todo.completed} class="mr-3" />
							<Form.Label class={todo.completed ? 'line-through' : ''}>{todo.text}</Form.Label>
						</div>
					{/snippet}
				</Form.Control>
			</div>
		{/if}
	{/each}
	{#if $value.every((todo) => !todo.text)}
		<div data-variant="view" class="-mt-4 text-muted-foreground"><p>...</p></div>
	{/if}
</Form.Fieldset>
