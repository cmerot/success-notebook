<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import * as Form from '$lib/components/ui/form/index.js';
	import EmoticonPopover from './emoticon-popover.svelte';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonProps } from './types';

	interface Props extends Omit<EmoticonProps, 'value'> {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode?: boolean;
		emoticonClass?: string;
	}

	let {
		form,
		name,
		isEditMode = false,
		class: className,
		emoticonClass,
		...restProps
	}: Props = $props();

	const emoticon = fieldProxy(form.form, name) as unknown as Writable<string>;
</script>

<Form.Field {form} {name} class={className}>
	{#if isEditMode}
		<Form.Control>
			{#snippet children({ props })}
				<EmoticonPopover bind:value={$emoticon} {...props} class={emoticonClass} {...restProps} />
			{/snippet}
		</Form.Control>
	{:else}
		<Emoticon value={$emoticon} class={emoticonClass} {...restProps} />
	{/if}
</Form.Field>
