<script lang="ts">
	import EditableTextBare from './editable-text-bare.svelte';
	import { cn } from '$lib/utils/utils';

	interface Props {
		isEditMode: boolean;
		value: string;
		multiline?: boolean;
		placeholder?: string;
		onBlur?: () => void;
		formProps?: Record<string, unknown>;
		containerClass?: string;
		inputClass?: string;
		viewClass?: string;
		disabled?: boolean;
		emptyText?: string;
	}

	let {
		isEditMode,
		value = $bindable(''),
		multiline = false,
		placeholder = '',
		onBlur,
		formProps = {},
		containerClass = '',
		inputClass = '',
		viewClass = '',
		disabled = false,
		emptyText = '...'
	}: Props = $props();
</script>

<div
	class={cn(
		'rounded-lg px-3 py-2',
		isEditMode && 'transition-colors hover:bg-accent',
		containerClass
	)}
>
	<EditableTextBare
		{isEditMode}
		bind:value
		{multiline}
		{placeholder}
		{onBlur}
		{formProps}
		inputClass={cn('w-full', inputClass)}
		viewClass={cn('w-full', viewClass)}
		{disabled}
		{emptyText}
	/>
</div>
