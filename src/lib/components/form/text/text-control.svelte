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
		onBlur?: () => void;
		placeholder?: string;
	}

	let { form, name, isEditMode, onBlur, placeholder = 'Nouvelle tâche...' }: Props = $props();

	const text = fieldProxy(form.form, name) as unknown as Writable<string>;
</script>

{#if isEditMode || $text}
	<Form.Control>
		{#snippet children({ props })}
			<EditableText
				{isEditMode}
				bind:value={$text}
				{placeholder}
				{onBlur}
				formProps={props}
				viewClass="min-h-[1.25rem] text-left text-foreground"
				emptyText=""
			/>
		{/snippet}
	</Form.Control>
{/if}
