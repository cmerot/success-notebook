<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import MoodChart from '$lib/components/charts/mood-chart.svelte';
	import TasksChart from '$lib/components/charts/tasks-chart.svelte';
	import GoalsProgressChart from '$lib/components/charts/goals-progress-chart.svelte';
	import RoutineHeatmap from '$lib/components/charts/routine-heatmap.svelte';
	import PeriodSelector from '$lib/components/period-selector.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Flame, ListRestart, Target, Zap } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { type PeriodType, calculatePeriodInfo, calculateAllStats } from '$lib/utils/stats';
	import { getLevelEmoticons } from '$lib/components/form/emoticon/level-emoticons';

	let { data }: PageProps = $props();

	// État local pour la navigation
	let selectedPeriod = $state<PeriodType>(data.period);
	let offset = $state(data.offset);

	// Calcul dérivé des informations de période et des stats
	let periodInfo = $derived(calculatePeriodInfo(selectedPeriod, offset, data.allEntries));
	let stats = $derived(
		calculateAllStats(data.allEntries, periodInfo.startDate, periodInfo.endDate)
	);

	const levelEmoticons = getLevelEmoticons();

	function handlePeriodChange(period: PeriodType) {
		selectedPeriod = period;
		offset = 0;
	}

	function handleNavigate(direction: 'prev' | 'next') {
		offset = direction === 'prev' ? offset + 1 : offset - 1;
	}
</script>

<Header title="Statistiques" variant="sidebar" />

<!-- Period Selector -->
<Surface.Root class="theme-purple">
	<Surface.Section>
		<PeriodSelector
			{selectedPeriod}
			onPeriodChange={handlePeriodChange}
			onNavigate={handleNavigate}
			canNavigateNext={periodInfo.canNavigateNext}
			periodLabel={periodInfo.periodLabel}
		/>
	</Surface.Section>
	<Surface.Section>
		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<!-- Streak Card -->
			<Card.Root class="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Série actuelle</Card.Title>
					<Flame class="size-5 text-orange-500" />
				</Card.Header>
				<Card.Content>
					<div class="text-3xl font-bold">{stats.streaks.currentStreak}</div>
					<p class="mt-1 text-xs text-muted-foreground">
						Record : {stats.streaks.longestStreak} jours
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Productivity Card -->
			<Card.Root class="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Réalisations quotidiennes</Card.Title>
					<Zap class="size-5 text-blue-500" />
				</Card.Header>
				<Card.Content>
					<div class="text-3xl font-bold">{stats.productivity.taskCompletionRate}%</div>
					<p class="mt-1 text-xs text-muted-foreground">
						{stats.productivity.totalCompleted}/{stats.productivity.totalPlanned} tâches
					</p>
				</Card.Content>
			</Card.Root>

			<!-- Routines Card (only if there are routines) -->
			{#if stats.routines.routines.length > 0}
				<Card.Root
					class="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
				>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Routines</Card.Title>
						<ListRestart class="size-5 text-emerald-500" />
					</Card.Header>
					<Card.Content>
						<div class="text-3xl font-bold">{stats.routines.adherenceRate}%</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{stats.routines.routines.length} routine{stats.routines.routines.length > 1
								? 's'
								: ''}
						</p>
					</Card.Content>
				</Card.Root>
			{/if}

			<!-- Goals Card -->
			<Card.Root class="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Objectifs</Card.Title>
					<Target class="size-5 text-purple-500" />
				</Card.Header>
				<Card.Content>
					<div class="text-3xl font-bold">{stats.goals.averageCompletion}%</div>
					<p class="mt-1 text-xs text-muted-foreground">
						{stats.goals.completedGoals}/{stats.goals.totalGoals} terminés
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</Surface.Section>
</Surface.Root>

<!-- Mood Stats -->
<Surface.Root class="theme-blue">
	<Surface.Header title="Humeur" />
	<Surface.Section>
		<MoodChart moodStats={stats.mood} {levelEmoticons} />
	</Surface.Section>
</Surface.Root>

<!-- Productivity Stats -->
<Surface.Root class="theme-green">
	<Surface.Header title="Réalisations quotidiennes" />
	<Surface.Section>
		<TasksChart productivityStats={stats.productivity} />
	</Surface.Section>
</Surface.Root>

<!-- Routines Stats -->
{#if stats.routines.routines.length > 0}
	<Surface.Root class="theme-orange">
		<Surface.Header title="Routines hebdomadaires" />
		<Surface.Section>
			<RoutineHeatmap data={stats.routines} />
		</Surface.Section>
	</Surface.Root>
{/if}

<!-- Goals Stats -->
{#if stats.goals.totalGoals > 0}
	<Surface.Root class="theme-purple">
		<Surface.Header title="Objectifs" />
		<Surface.Section>
			<GoalsProgressChart data={stats.goals} />
		</Surface.Section>
	</Surface.Root>
{/if}
