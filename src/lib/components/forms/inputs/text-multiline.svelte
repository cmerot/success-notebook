<script lang="ts" generics="T extends z.ZodObject<any>">
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SuperFormData, FormPath } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import type { FsSuperForm } from 'formsnap';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Writable } from 'svelte/store';

	type InferredType = z.infer<T>;

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		label: string;
	}
	let { form, formData, name, label }: Props = $props();
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<string>);
</script>

<Form.Field {form} {name} data-container>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>{label}</Form.Label>
			<div data-variant="edit">
				<div>
					<Textarea {...props} bind:value={$value} class="bg-background" />
				</div>
			</div>
			<div data-variant="view">
				<div>
					<p class="whitespace-pre-line">{$value || '...'}</p>
				</div>
			</div>
		{/snippet}
	</Form.Control>
</Form.Field>
