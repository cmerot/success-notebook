<script lang="ts">
	import { cn } from '$lib/utils/utils';

	interface Props {
		isEditMode: boolean;
		value: string;
		multiline?: boolean;
		placeholder?: string;
		onBlur?: () => void;
		formProps?: Record<string, unknown>;
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
		inputClass = '',
		viewClass = '',
		disabled = false,
		emptyText = '...'
	}: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (!multiline && event.key === 'Enter') {
			(event.target as HTMLElement).blur();
		}
	}

	function handleBlur() {
		onBlur?.();
	}

	const baseInputClass =
		'block border-b-2 border-primary/20 bg-transparent pb-0.5 text-sm outline-none placeholder:text-muted-foreground';
	const baseViewClass = 'border-b-2 border-transparent bg-transparent pb-0.5 text-sm';
</script>

{#if isEditMode}
	{#if multiline}
		<textarea
			{...formProps}
			bind:value
			{placeholder}
			{disabled}
			onblur={handleBlur}
			class={cn(baseInputClass, inputClass)}
		></textarea>
	{:else}
		<input
			{...formProps}
			type="text"
			bind:value
			{placeholder}
			{disabled}
			autocomplete="off"
			onkeydown={handleKeydown}
			onblur={handleBlur}
			class={cn(baseInputClass, inputClass)}
		/>
	{/if}
{:else}
	<div class={cn(baseViewClass, viewClass)}>
		{value || emptyText}
	</div>
{/if}
