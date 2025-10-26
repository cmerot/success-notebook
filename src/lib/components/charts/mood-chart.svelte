<script lang="ts">
	import { LineChart, Spline, Axis, Tooltip } from 'layerchart';
	import { parseDate } from '@internationalized/date';
	import type { MoodStats } from '$lib/utils/stats';
	import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import { cn } from '$lib/utils/utils';
	import type { LevelEmoticons } from '$lib/components/form/emoticon/level-emoticons';

	interface MoodDataPoint {
		date: string;
		level: number;
	}

	interface ChartDataPoint {
		date: Date;
		average: number | null;
		start: number | null;
		end: number | null;
	}

	interface Props {
		data?: MoodDataPoint[];
		moodStats?: MoodStats;
		levelEmoticons?: LevelEmoticons;
	}

	let { data, moodStats, levelEmoticons }: Props = $props();

	// Fonction pour obtenir l'émoticône d'un niveau
	function getEmoticon(level: number | null): string {
		if (!levelEmoticons || level === null) return '';
		const roundedLevel = Math.round(level) as keyof typeof levelEmoticons;
		return levelEmoticons[roundedLevel] || '';
	}

	// Préparer les données pour LineChart avec plusieurs séries
	const chartData = $derived(() => {
		if (moodStats) {
			// Les séries contiennent déjà tous les jours avec null pour les valeurs manquantes
			return moodStats.averageSeries.map((avgPoint, index) => ({
				date: avgPoint.date,
				average: avgPoint.value,
				start: moodStats.startSeries[index]?.value ?? null,
				end: moodStats.endSeries[index]?.value ?? null
			}));
		} else if (data) {
			return data.map((point) => ({
				date: parseDate(point.date).toDate('UTC'),
				average: point.level,
				start: null,
				end: null
			}));
		}
		return [];
	});

	// Données pour le graphique combiné (2 points par jour)
	const combinedChartData = $derived(() => {
		if (moodStats?.combinedSeries) {
			return moodStats.combinedSeries.map((point) => ({
				date: point.date,
				value: point.value,
				type: point.type
			}));
		}
		return [];
	});

	const trendIcon = $derived(() => {
		if (!moodStats) return Minus;
		switch (moodStats.trend) {
			case 'improving':
				return TrendingUp;
			case 'declining':
				return TrendingDown;
			default:
				return Minus;
		}
	});

	const trendColor = $derived(() => {
		if (!moodStats) return 'text-muted-foreground';
		switch (moodStats.trend) {
			case 'improving':
				return 'text-green-600 dark:text-green-400';
			case 'declining':
				return 'text-orange-600 dark:text-orange-400';
			default:
				return 'text-muted-foreground';
		}
	});

	const trendLabel = $derived(() => {
		if (!moodStats) return 'Stable';
		switch (moodStats.trend) {
			case 'improving':
				return 'En amélioration';
			case 'declining':
				return 'En baisse';
			default:
				return 'Stable';
		}
	});
</script>

{#if chartData().length === 0}
	<div class="py-12 text-center">
		<p class="text-muted-foreground">Aucune donnée d'humeur disponible</p>
		<p class="mt-2 text-sm text-muted-foreground">
			Commence à remplir ton carnet quotidien pour voir l'évolution de ton humeur
		</p>
	</div>
{:else}
	<div class="space-y-4">
		{#if moodStats}
			<!-- Summary stats -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="text-center">
					<p class="text-2xl font-bold">
						{moodStats.average}
						{#if levelEmoticons}
							<span class="ml-2 text-3xl">{getEmoticon(moodStats.average)}</span>
						{/if}
					</p>
					<p class="text-xs text-muted-foreground">Moyenne générale</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold">
						{moodStats.startAverage}
						{#if levelEmoticons}
							<span class="ml-2 text-3xl">{getEmoticon(moodStats.startAverage)}</span>
						{/if}
					</p>
					<p class="text-xs text-muted-foreground">Matin</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold">
						{moodStats.endAverage}
						{#if levelEmoticons}
							<span class="ml-2 text-3xl">{getEmoticon(moodStats.endAverage)}</span>
						{/if}
					</p>
					<p class="text-xs text-muted-foreground">Soir</p>
				</div>
				<div class="text-center">
					{#if moodStats}
						{@const Icon = trendIcon()}
						<div class="flex items-center justify-center gap-1">
							<Icon class="h-5 w-5 {trendColor()}" />
						</div>
						<p class="text-xs {trendColor()}">{trendLabel()}</p>
					{/if}
				</div>
			</div>
		{/if}

		{#if combinedChartData().length > 0}
			<div class="h-[600px] rounded-sm border p-4">
				<LineChart
					data={combinedChartData()}
					x="date"
					series={[{ key: 'value', label: 'Humeur', color: 'var(--chart-1)' }]}
					yDomain={[0.5, 5.5]}
					yNice={false}
					legend
					props={{
						xAxis: {
							format: (d) => {
								const date = new Date(d);
								const hours = date.getHours();
								const day = date.getDate().toString().padStart(2, '0');
								const month = (date.getMonth() + 1).toString().padStart(2, '0');
								return `${day}/${month} ${hours}h`;
							}
						},
						yAxis: {
							ticks: 5,
							format: levelEmoticons
								? (d) => {
										const level = Math.round(d);
										return levelEmoticons[level as keyof typeof levelEmoticons] || '';
									}
								: undefined
						}
					}}
				>
					{#snippet belowMarks()}
						<Spline
							data={combinedChartData()}
							y="value"
							stroke="var(--chart-1)"
							class="[stroke-dasharray:3,3]"
						/>
					{/snippet}

					{#snippet tooltip({ context })}
						<Tooltip.Root>
							{#snippet children({ data })}
								{@const date = new Date(context.x(data))}
								{@const hours = date.getHours()}
								{@const day = date.getDate().toString().padStart(2, '0')}
								{@const month = (date.getMonth() + 1).toString().padStart(2, '0')}
								{@const typeLabel = data.type === 'start' ? 'Matin' : 'Soir'}
								{@const emoticon = getEmoticon(data.value)}
								<Tooltip.Header>{day}/{month} {hours}h - {typeLabel}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Humeur"
										value={levelEmoticons ? `${data.value} ${emoticon}` : data.value}
										color="var(--chart-1)"
									/>
								</Tooltip.List>
							{/snippet}
						</Tooltip.Root>
					{/snippet}
				</LineChart>
			</div>
		{/if}

		<div class="h-[600px] rounded-sm border p-4">
			<LineChart
				data={chartData()}
				x="date"
				series={[
					{ key: 'average', label: 'Moyenne', color: 'var(--chart-1)' },
					{ key: 'start', label: 'Matin', color: 'var(--chart-3)' },
					{ key: 'end', label: 'Soir', color: 'var(--chart-5)' }
				]}
				yDomain={[0.5, 5.5]}
				yNice={false}
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
						ticks: 5,
						format: levelEmoticons
							? (d) => {
									const level = Math.round(d);
									return levelEmoticons[level as keyof typeof levelEmoticons] || '';
								}
							: undefined
					}
				}}
			>
				{#snippet belowMarks({ visibleSeries, highlightKey })}
					{#each visibleSeries as s}
						<Spline
							data={chartData().filter((d) => d[s.key as keyof ChartDataPoint] !== null)}
							y={s.key}
							stroke={s.color}
							class={cn(
								'transition-opacity [stroke-dasharray:3,3]',
								highlightKey && highlightKey !== s.key && 'opacity-50'
							)}
						/>
					{/each}
				{/snippet}

				{#snippet tooltip({ context, visibleSeries })}
					<Tooltip.Root>
						{#snippet children({ data })}
							{@const date = new Date(context.x(data))}
							{@const day = date.getDate().toString().padStart(2, '0')}
							{@const month = (date.getMonth() + 1).toString().padStart(2, '0')}
							<Tooltip.Header>{day}/{month}</Tooltip.Header>
							<Tooltip.List>
								{#each visibleSeries as s}
									{@const value = data[s.key]}
									{#if value !== null && value !== undefined}
										{@const label =
											s.key === 'average' ? 'Moyenne' : s.key === 'start' ? 'Matin' : 'Soir'}
										{@const emoticon = getEmoticon(value)}
										<Tooltip.Item
											{label}
											value={levelEmoticons ? `${value} ${emoticon}` : value}
											color={s.color}
										/>
									{/if}
								{/each}
							</Tooltip.List>
						{/snippet}
					</Tooltip.Root>
				{/snippet}
			</LineChart>
		</div>
	</div>
{/if}
