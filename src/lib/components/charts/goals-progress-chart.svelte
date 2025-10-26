<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { BarChart } from 'layerchart';
	import { parseDate } from '@internationalized/date';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils';
	import type { GoalStats } from '$lib/utils/stats';

	interface Props {
		data: GoalStats;
	}

	let { data }: Props = $props();

	// Combine weekly and monthly goals into a single timeline
	const chartData = $derived(() => {
		const combined = [
			...data.weeklyGoals.map((g) => ({
				date: parseDate(g.date).toDate('UTC'),
				dateStr: g.date,
				weekCompletion: g.averageCompletion,
				monthCompletion: null,
				type: 'Semaine',
				goals: g.goals
			})),
			...data.monthlyGoals.map((g) => ({
				date: parseDate(g.date).toDate('UTC'),
				dateStr: g.date,
				weekCompletion: null,
				monthCompletion: g.averageCompletion,
				type: 'Mois',
				goals: g.goals
			}))
		].sort((a, b) => a.date.getTime() - b.date.getTime());

		return combined;
	});

	const chartConfig = {
		weekCompletion: {
			label: 'Objectifs hebdomadaires',
			color: 'hsl(262, 83%, 58%)' // purple-500
		},
		monthCompletion: {
			label: 'Objectifs mensuels',
			color: 'hsl(280, 70%, 50%)' // violet-600
		}
	} satisfies ChartConfig;
</script>

{#if chartData().length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">Aucune donnée d'objectifs disponible</p>
		<p class="mt-2 text-sm text-muted-foreground">
			Commence à définir des objectifs hebdomadaires et mensuels pour voir ta progression
		</p>
	</div>
{:else}
	<div class="space-y-4">
		<!-- Summary stats -->
		<div class="grid grid-cols-3 gap-4 text-center">
			<div>
				<p class="text-2xl font-bold">{data.averageCompletion}%</p>
				<p class="text-xs text-muted-foreground">Complétion moyenne</p>
			</div>
			<div>
				<p class="text-2xl font-bold">{data.completedGoals}</p>
				<p class="text-xs text-muted-foreground">Objectifs terminés</p>
			</div>
			<div>
				<p class="text-2xl font-bold">{data.totalGoals}</p>
				<p class="text-xs text-muted-foreground">Total objectifs</p>
			</div>
		</div>

		<Chart.Container config={chartConfig} class="h-[300px] w-full">
			<BarChart
				data={chartData()}
				x="date"
				axis="x"
				yDomain={[0, 100]}
				yNice={false}
				padding={{ left: 32, right: 16, top: 16, bottom: 32 }}
				series={[
					{
						key: 'weekCompletion',
						label: chartConfig.weekCompletion.label,
						color: chartConfig.weekCompletion.color
					},
					{
						key: 'monthCompletion',
						label: chartConfig.monthCompletion.label,
						color: chartConfig.monthCompletion.color
					}
				]}
				legend
				props={{
					xAxis: {
						format: (d) => {
							const date = new Date(d);
							const day = date.getDate().toString().padStart(2, '0');
							const month = (date.getMonth() + 1).toString().padStart(2, '0');
							return `${day}/${month}`;
						}
					},
					yAxis: {
						format: (d) => `${d}%`,
						ticks: [0, 25, 50, 75, 100]
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(value, payload) => {
							if (payload && payload.length > 0 && payload[0].payload) {
								const item = payload[0].payload;
								return `${item.type} du ${new Date(item.date).toLocaleDateString('fr-FR', {
									day: '2-digit',
									month: '2-digit'
								})}`;
							}
							return value;
						}}
					>
						{#snippet formatter({ value, name, item, index })}
							{#if value !== null}
								<div class="space-y-1">
									<div class="flex flex-1 justify-between leading-none">
										<span class="text-muted-foreground">
											{name}
										</span>
										<span class="font-mono font-medium text-foreground tabular-nums">
											{typeof value === 'number' ? `${value}%` : value}
										</span>
									</div>
									{#if index === 0 && item.payload && item.payload.goals}
										<div class="mt-2 border-t pt-2">
											<p class="mb-1 text-xs font-semibold">Objectifs :</p>
											{#each item.payload.goals as goal}
												<div class="flex justify-between gap-2 text-xs">
													<span class="max-w-[200px] truncate">{goal.text}</span>
													<span class="font-mono">{goal.completion}%</span>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						{/snippet}
					</Chart.Tooltip>
				{/snippet}
			</BarChart>
		</Chart.Container>
	</div>
{/if}
