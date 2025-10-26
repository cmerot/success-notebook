<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import * as Form from '$lib/components/ui/form/index.js';
	import EmoticonLevelPopover from './emoticon-level-popover.svelte';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonSize } from './emoticon-sizes';
	import { getMoodEmoticons, type MoodScale } from './emoticons-level';
	import { cn } from '$lib/utils/utils';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode?: boolean;
		size?: EmoticonSize;
		class?: string;
		emoticonClass?: string;
		fallback?: string;
	}

	let {
		form,
		name,
		isEditMode = false,
		size = 'md',
		class: className,
		emoticonClass,
		fallback
	}: Props = $props();

	const level = fieldProxy(form.form, name) as unknown as Writable<number | undefined>;

	const emoticons = getMoodEmoticons();
	const currentEmoticon = $derived(
		$level !== undefined && $level in emoticons ? emoticons[$level as MoodScale] : undefined
	);
</script>

<Form.Field {form} {name} class={className}>
	{#if isEditMode}
		<Form.Control>
			{#snippet children({ props })}
				<EmoticonLevelPopover
					bind:value={$level}
					{size}
					class={emoticonClass}
					{...props}
					{fallback}
				/>
			{/snippet}
		</Form.Control>
	{:else}
		<Emoticon
			value={currentEmoticon}
			{size}
			class={cn('border-2 border-transparent', emoticonClass)}
			ariaLabel={$level !== undefined ? `Niveau ${$level}` : 'Aucun niveau'}
			{fallback}
		/>
	{/if}
</Form.Field>
