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
	import { Label } from '$lib/components/ui/field';

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
						<button class="mr-3 {todo.completed ? ' text-primary' : ' text-muted-foreground'}">
							<Check /> <span class="sr-only">Toggle checkbox</span></button
						>
						<Input {...props} bind:value={todo.text} autocomplete="off" class="border-none" />
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

<pre>
```
mode lecture :

- completed: checkbox
- text:      label

mode edit :

- completed: fausse checkbox
- text:      input


mode full :

- completed: checkbox
- text:      input
```
</pre>

<Label
	class="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
>
	<Checkbox
		id="toggle-2"
		checked
		class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
	/>
	<div class="grid gap-1.5 font-normal">
		<p class="text-sm leading-none font-medium">Enable notifications</p>
		<p class="text-sm text-muted-foreground">
			You can enable or disable notifications at any time.
		</p>
	</div>
</Label>
