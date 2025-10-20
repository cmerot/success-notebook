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
	class="relative flex size-5 shrink-0 items-center justify-center rounded-full border-[2px] border-muted-foreground/50 transition-all outline-none hover:border-muted-foreground/70 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-muted-foreground data-[state=checked]:bg-muted-foreground"
>
	{#snippet children({ checked })}
		{#if checked}
			<CheckIcon class="size-3 text-background" strokeWidth={3} />
		{:else}
			<!-- Visible inner circle when unchecked for better visibility -->
			<div class="size-2.5 rounded-full border border-muted-foreground/30"></div>
		{/if}
	{/snippet}
</CheckboxPrimitive.Root>
