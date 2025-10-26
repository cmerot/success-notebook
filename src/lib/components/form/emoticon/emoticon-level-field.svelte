<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import * as Form from '$lib/components/ui/form/index.js';
	import EmoticonLevelPopover from './emoticon-level-popover.svelte';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonSize } from './emoticon-sizes';
	import { getLevelEmoticons, type MoodLevel } from './level-emoticons';
	import { cn } from '$lib/utils/utils';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode?: boolean;
		size?: EmoticonSize;
		class?: string;
		emoticonClass?: string;
	}

	let {
		form,
		name,
		isEditMode = false,
		size = 'md',
		class: className,
		emoticonClass
	}: Props = $props();

	const level = fieldProxy(form.form, name) as unknown as Writable<number | undefined>;

	const levelEmoticons = getLevelEmoticons();
	const currentEmoticon = $derived(
		$level !== undefined && $level in levelEmoticons
			? levelEmoticons[$level as MoodLevel]
			: undefined
	);
</script>

<Form.Field {form} {name} class={className}>
	{#if isEditMode}
		<Form.Control>
			{#snippet children({ props })}
				<EmoticonLevelPopover bind:value={$level} {size} class={emoticonClass} {...props} />
			{/snippet}
		</Form.Control>
	{:else}
		<Emoticon
			value={currentEmoticon}
			{size}
			class={cn('border-2 border-transparent', emoticonClass)}
			ariaLabel={$level !== undefined ? `Niveau ${$level}` : 'Aucun niveau'}
		/>
	{/if}
</Form.Field>
