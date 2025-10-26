<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { BarChart } from 'layerchart';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils';
	import type { DayStatsPoint } from '$lib/utils/stats';

	interface Props {
		data: DayStatsPoint[];
	}

	let { data }: Props = $props();

	const chartConfig = {
		mood: {
			label: 'Humeur',
			color: 'var(--chart-1)'
		},
		tasksScore: {
			label: 'Tâches',
			color: 'var(--chart-2)'
		}
	} satisfies ChartConfig;
</script>

{#if data.length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">Aucune donnée disponible</p>
		<p class="mt-2 text-sm text-muted-foreground">
			Commence à remplir ton carnet quotidien pour voir tes statistiques
		</p>
	</div>
{:else}
	<Chart.Container config={chartConfig} class="h-[300px] w-full">
		<BarChart
			{data}
			x="date"
			axis="x"
			yDomain={[0, 5]}
			yNice={false}
			seriesLayout="group"
			legend
			labels
			padding={{ left: 32, right: 16, top: 16, bottom: 32 }}
			series={[
				{
					key: 'mood',
					label: chartConfig.mood.label,
					color: chartConfig.mood.color
				},
				{
					key: 'tasksScore',
					label: chartConfig.tasksScore.label,
					color: chartConfig.tasksScore.color
				}
			]}
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
					ticks: [0, 1, 2, 3, 4, 5]
				}
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip
					labelFormatter={(value, payload) => {
						if (payload && payload.length > 0 && payload[0].payload) {
							return new Date(payload[0].payload.date).toLocaleDateString('fr-FR', {
								day: '2-digit',
								month: '2-digit'
							});
						}
						return value;
					}}
				>
					{#snippet formatter({ value, name, item })}
						<div class="flex flex-1 justify-between leading-none">
							<span class="text-muted-foreground">
								{name}
							</span>
							<span class="font-mono font-medium text-foreground tabular-nums">
								{#if item.key === 'tasksScore' && item.payload}
									{item.payload.tasksCompleted}/{item.payload.tasksTotal}
								{:else}
									{typeof value === 'number' ? value.toFixed(1) : value}
								{/if}
							</span>
						</div>
					{/snippet}
				</Chart.Tooltip>
			{/snippet}
		</BarChart>
	</Chart.Container>
{/if}
