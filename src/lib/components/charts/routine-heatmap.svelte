<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { BarChart } from 'layerchart';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils';
	import type { RoutineStats } from '$lib/utils/stats';

	interface Props {
		data: RoutineStats;
	}

	let { data }: Props = $props();

	const chartConfig = {
		adherence: {
			label: 'Adhérence',
			color: 'var(--chart-4)'
		}
	} satisfies ChartConfig;

	// Sort routines by adherence rate (best first)
	const sortedRoutines = $derived(
		[...data.routines].sort((a, b) => b.adherenceRate - a.adherenceRate)
	);
</script>

{#if data.routines.length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">Aucune donnée de routines hebdomadaires disponible</p>
		<p class="mt-2 text-sm text-muted-foreground">
			Définis des routines hebdomadaires pour suivre ton adhérence
		</p>
	</div>
{:else}
	<div class="space-y-6">
		<!-- Overall adherence -->
		<div class="text-center">
			<p class="text-3xl font-bold">{data.adherenceRate}%</p>
			<p class="text-sm text-muted-foreground">Adhérence globale aux routines</p>
		</div>

		<!-- Individual routines -->
		<div>
			<h4 class="mb-4 text-sm font-semibold">Routines individuelles</h4>
			<div class="space-y-3">
				{#each sortedRoutines as routine}
					<div class="space-y-1">
						<div class="flex items-center justify-between text-sm">
							<span class="font-medium">{routine.name}</span>
							<span class="text-muted-foreground">
								{routine.completedDays}/{routine.plannedDays} jours ({routine.adherenceRate}%)
							</span>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
							<div
								class="h-full rounded-full bg-chart-4 transition-all"
								style="width: {routine.adherenceRate}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Stats by day of week -->
		{#if data.byDayOfWeek.length > 0}
			<div>
				<h4 class="mb-4 text-sm font-semibold">Adhérence par jour de la semaine</h4>
				<Chart.Container config={chartConfig} class="h-[200px] w-full">
					<BarChart
						data={data.byDayOfWeek.slice(1).concat([data.byDayOfWeek[0]])}
						x={(d) => d.dayName}
						axis="x"
						yDomain={[0, 100]}
						yNice={false}
						padding={{ left: 32, right: 16, top: 16, bottom: 32 }}
						series={[
							{
								key: 'adherenceRate',
								label: chartConfig.adherence.label,
								color: chartConfig.adherence.color
							}
						]}
						props={{
							xAxis: {
								format: (d) => d.substring(0, 3)
							},
							yAxis: {
								format: (d) => `${d}%`,
								ticks: [0, 25, 50, 75, 100]
							}
						}}
					>
						{#snippet tooltip()}
							<Chart.Tooltip>
								{#snippet formatter({ value, name, item })}
									<div class="flex flex-1 justify-between leading-none">
										<span class="text-muted-foreground">
											{item.payload.dayName}
										</span>
										<span class="font-mono font-medium text-foreground tabular-nums">
											{typeof value === 'number' ? `${value}%` : value}
										</span>
									</div>
								{/snippet}
							</Chart.Tooltip>
						{/snippet}
					</BarChart>
				</Chart.Container>
			</div>
		{/if}

		<!-- Best and worst routines -->
		{#if sortedRoutines.length >= 2}
			<div class="grid grid-cols-2 gap-4 text-center">
				<div class="rounded-lg border bg-green-50 p-3 dark:bg-green-950/20">
					<p class="mb-1 text-xs text-muted-foreground">Meilleure adhérence</p>
					<p class="truncate text-sm font-semibold">{sortedRoutines[0].name}</p>
					<p class="text-lg font-bold text-green-600 dark:text-green-400">
						{sortedRoutines[0].adherenceRate}%
					</p>
				</div>
				<div class="rounded-lg border bg-orange-50 p-3 dark:bg-orange-950/20">
					<p class="mb-1 text-xs text-muted-foreground">À améliorer</p>
					<p class="truncate text-sm font-semibold">
						{sortedRoutines[sortedRoutines.length - 1].name}
					</p>
					<p class="text-lg font-bold text-orange-600 dark:text-orange-400">
						{sortedRoutines[sortedRoutines.length - 1].adherenceRate}%
					</p>
				</div>
			</div>
		{/if}
	</div>
{/if}
