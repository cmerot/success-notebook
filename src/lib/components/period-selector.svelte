<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-svelte';

	export type PeriodType = 'week' | 'month' | 'all';

	interface Props {
		selectedPeriod: PeriodType;
		onPeriodChange: (period: PeriodType) => void;
		onNavigate: (direction: 'prev' | 'next') => void;
		canNavigateNext?: boolean;
		periodLabel?: string;
	}

	let {
		selectedPeriod,
		onPeriodChange,
		onNavigate,
		canNavigateNext = false,
		periodLabel
	}: Props = $props();

	const periodOptions = [
		{ value: 'week', label: 'Semaine', icon: CalendarDays },
		{ value: 'month', label: 'Mois', icon: Calendar },
		{ value: 'all', label: 'Global', icon: null }
	] as const;
</script>

<div class="flex flex-col items-center gap-3">
	<!-- Sélecteur de type de période -->
	<div class="flex gap-1">
		{#each periodOptions as option}
			<Button
				variant={selectedPeriod === option.value ? 'default' : 'outline'}
				onclick={() => onPeriodChange(option.value)}
				class="min-w-[90px]"
			>
				{#if option.icon}
					{@const Icon = option.icon}
					<Icon class="mr-1 size-4" />
				{/if}
				{option.label}
			</Button>
		{/each}
	</div>

	<!-- Navigation de période avec label -->
	{#if selectedPeriod !== 'all' && periodLabel}
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				onclick={() => onNavigate('prev')}
				aria-label="Période précédente"
			>
				<ChevronLeft class="size-4" />
			</Button>

			<span class="min-w-[150px] text-center text-sm text-muted-foreground">
				{periodLabel}
			</span>

			<Button
				variant="outline"
				size="icon"
				onclick={() => onNavigate('next')}
				disabled={!canNavigateNext}
				aria-label="Période suivante"
			>
				<ChevronRight class="size-4" />
			</Button>
		</div>
	{/if}
</div>
