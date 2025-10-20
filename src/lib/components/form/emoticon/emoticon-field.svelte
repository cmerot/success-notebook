<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import EmoticonChooser from './emoticon-popover.svelte';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode?: boolean;
		class?: string;
	}

	let { form, name, isEditMode = false, class: className }: Props = $props();

	const emoticon = fieldProxy(form.form, name) as unknown as Writable<string>;
</script>

<Form.Field {form} {name} class={className}>
	{#if isEditMode}
		<Form.Control>
			{#snippet children({ props })}
				<EmoticonChooser bind:value={$emoticon} {...props} />
			{/snippet}
		</Form.Control>
	{:else}
		<div
			class={'inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-input bg-background text-4xl'}
			aria-label="Émoticône sélectionnée"
		>
			{#if $emoticon}
				{$emoticon}
			{:else}
				<span class="opacity-50">☀️</span>
			{/if}
		</div>
	{/if}
</Form.Field>
