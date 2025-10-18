<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import EditableText from '$lib/components/form/text/editable-text.svelte';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode: boolean;
		class?: string;
		placeholder?: string;
		label?: string;
		multiline?: boolean;
	}

	let {
		form,
		name,
		isEditMode,
		class: className,
		placeholder,
		label,
		multiline = false
	}: Props = $props();

	const value = fieldProxy(form.form, name) as unknown as Writable<string>;
</script>

<Form.Field {form} {name} class={className}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label}
				<Form.Label class="mb-3 text-lg font-semibold text-primary">{label}</Form.Label>
			{/if}
			<EditableText {isEditMode} bind:value={$value} {placeholder} formProps={props} {multiline} />
		{/snippet}
	</Form.Control>
</Form.Field>
