<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { BarChart } from 'layerchart';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils';
	import type { CalendarDate } from '@internationalized/date';
	import type { ProductivityStats } from '$lib/utils/stats';

	interface TasksDataPoint {
		date: CalendarDate;
		planned: number;
		completed: number;
	}

	interface Props {
		data?: TasksDataPoint[];
		productivityStats?: ProductivityStats;
	}

	let { data, productivityStats }: Props = $props();

	// Transform data for the chart - by day of week with 4 stacks
	const chartData = $derived(() => {
		if (!productivityStats) return [];

		// Group data by day of week
		const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
		const byDay = new Map<
			string,
			{
				todoCompleted: number;
				todoRemaining: number;
				relaxCompleted: number;
				relaxRemaining: number;
			}
		>();

		// Initialize all days
		dayNames.forEach((day) => {
			byDay.set(day, { todoCompleted: 0, todoRemaining: 0, relaxCompleted: 0, relaxRemaining: 0 });
		});

		// Aggregate data points by day of week
		productivityStats.dataPoints.forEach((point) => {
			const dayName = dayNames[point.date.getDay()];
			const current = byDay.get(dayName)!;

			current.todoCompleted += point.todoCompleted;
			current.todoRemaining += point.todoPlanned - point.todoCompleted;
			current.relaxCompleted += point.relaxCompleted;
			current.relaxRemaining += point.relaxPlanned - point.relaxCompleted;
		});

		// Convert to array, starting with Monday
		const orderedDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
		return orderedDays.map((dayName) => ({
			dayName,
			...byDay.get(dayName)!
		}));
	});

	const chartConfig = {
		todoCompleted: {
			label: 'Todo réalisées',
			color: 'hsl(142, 76%, 36%)' // green-600
		},
		todoRemaining: {
			label: 'Todo restantes',
			color: 'hsl(142, 76%, 70%)' // green-300
		},
		relaxCompleted: {
			label: 'Détente réalisées',
			color: 'hsl(221, 83%, 53%)' // blue-600
		},
		relaxRemaining: {
			label: 'Détente restantes',
			color: 'hsl(221, 83%, 75%)' // blue-300
		}
	} satisfies ChartConfig;
</script>

{#if chartData().length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">Aucune donnée de tâches disponible</p>
	</div>
{:else}
	<div class="space-y-4">
		{#if productivityStats}
			<!-- Summary stats -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="text-center">
					<p class="text-2xl font-bold">{productivityStats.taskCompletionRate}%</p>
					<p class="text-xs text-muted-foreground">Taux global</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold">{productivityStats.todoCompletionRate}%</p>
					<p class="text-xs text-muted-foreground">Todo</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold">{productivityStats.relaxCompletionRate}%</p>
					<p class="text-xs text-muted-foreground">Détente</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold">
						{productivityStats.totalCompleted}/{productivityStats.totalPlanned}
					</p>
					<p class="text-xs text-muted-foreground">Tâches complétées</p>
				</div>
			</div>
		{/if}

		<Chart.Container config={chartConfig} class="h-[350px] w-full">
			<BarChart
				data={chartData()}
				x={(d) => d.dayName}
				axis="x"
				seriesLayout="stack"
				padding={{ left: 32, right: 16, top: 16, bottom: 48 }}
				series={[
					{
						key: 'todoCompleted',
						label: chartConfig.todoCompleted.label,
						color: chartConfig.todoCompleted.color
					},
					{
						key: 'relaxCompleted',
						label: chartConfig.relaxCompleted.label,
						color: chartConfig.relaxCompleted.color
					},
					{
						key: 'todoRemaining',
						label: chartConfig.todoRemaining.label,
						color: chartConfig.todoRemaining.color
					},
					{
						key: 'relaxRemaining',
						label: chartConfig.relaxRemaining.label,
						color: chartConfig.relaxRemaining.color
					}
				]}
				legend
				props={{
					xAxis: {
						format: (d) => d.substring(0, 3)
					},
					yAxis: {
						ticks: 5
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip>
						{#snippet formatter({ value, name })}
							<div class="flex flex-1 justify-between leading-none">
								<span class="text-muted-foreground">
									{name}
								</span>
								<span class="font-mono font-medium text-foreground tabular-nums">
									{typeof value === 'number' ? value : value}
								</span>
							</div>
						{/snippet}
					</Chart.Tooltip>
				{/snippet}
			</BarChart>
		</Chart.Container>
	</div>
{/if}
