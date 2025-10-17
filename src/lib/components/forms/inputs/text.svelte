<script lang="ts" generics="T extends z.ZodObject<any>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import type { SuperFormData, FormPath } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import type { FsSuperForm } from 'formsnap';
	import { fieldProxy } from 'sveltekit-superforms/client';

	type InferredType = z.infer<T>;

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		label: string;
	}
	let { form, formData, name, label }: Props = $props();
	let value = $derived(fieldProxy(formData, name));
</script>

<Form.Field {form} {name} data-container>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>{label}</Form.Label>
			<div data-variant="edit">
				<div>
					<Input {...props} bind:value={$value} autocomplete="off" />
				</div>
			</div>
			<div data-variant="view">
				<div>
					<p class="text-muted-foreground">{$value || '...'}</p>
				</div>
			</div>
		{/snippet}
	</Form.Control>
</Form.Field>
