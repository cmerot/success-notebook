<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import CheckIcon from '@lucide/svelte/icons/check';

	interface Props {
		checked: boolean;
		disabled?: boolean;
	}

	let { checked = $bindable(), disabled = false }: Props = $props();

	const ariaLabel = $derived(checked ? 'Marquer comme non complété' : 'Marquer comme complété');
</script>

<CheckboxPrimitive.Root
	bind:checked
	{disabled}
	aria-label={ariaLabel}
	class="border-muted-foreground/50 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:border-muted-foreground/70 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-5 shrink-0 items-center justify-center rounded-full border-[2px] outline-none transition-all focus-visible:ring-[3px]"
>
	{#snippet children({ checked })}
		{#if checked}
			<CheckIcon class="text-background size-3" strokeWidth={3} />
		{:else}
			<!-- Visible inner circle when unchecked for better visibility -->
			<div class="border-muted-foreground/30 size-2.5 rounded-full border"></div>
		{/if}
	{/snippet}
</CheckboxPrimitive.Root>
