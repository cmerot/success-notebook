<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { Notebook, DayForm, MonthForm, WeekForm } from '$lib/components/notebook';
	import { formatDay, formatMonth, formatWeek, today } from '$lib/utils/date';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import DatePicker from '$lib/components/date-picker/date-picker.svelte';
	import { dayConfig, monthConfig, weekConfig } from '$lib/components/notebook/config';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let dateIsToday = $derived(data.date.compare(today) === 0);

	function showMenu() {
		goto(resolve('/menu'));
	}

	let title = $derived.by(() => {
		if (data.period == 'day') {
			return `${formatDay(data.date, 'numeric')} - ${dayConfig.emptyState.title}`;
		} else if (data.period == 'week') {
			return `${formatWeek(data.date, 'numeric')} - ${weekConfig.emptyState.title}`;
		} else if (data.period == 'month') {
			return `${formatMonth(data.date, 'numeric')} - ${monthConfig.emptyState.title}`;
		} else if (data.date.compare(today) !== 0) {
			return `${formatDay(data.date, 'numeric')} - Carnet`;
		}
		return 'Carnet de succès';
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if data.period == 'day'}
	<Header class={dayConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès du quotidien</span>
				<DatePicker class="ml-auto" date={data.date}>
					<span class="xs:hidden">{data.date.year}</span>
					<span class="hidden xs:inline">{formatDay(data.date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	{#key `${data.date}`}
		<DayForm {data} />
	{/key}
{:else if data.period == 'week'}
	<Header class={weekConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès de la semaine</span>
				<DatePicker class="ml-auto" date={data.date}>
					<span class="xs:hidden">{data.date.year}</span>
					<span class="hidden xs:inline">{formatWeek(data.date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>
	{#key `${data.date}`}
		<WeekForm {data} />
	{/key}
{:else if data.period == 'month'}
	<Header class={monthConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès du mois</span>
				<DatePicker class="ml-auto" date={data.date}>
					<span class="xs:hidden">{data.date.year}</span>
					<span class="hidden xs:inline">{formatMonth(data.date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	{#key `${data.date}`}
		<MonthForm {data} />
	{/key}
{:else}
	<Header variant="sidebar" nav={dateIsToday ? nav : undefined}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Carnet de succès</span>
				<DatePicker class="ml-auto" date={data.date}>
					<span class="xs:hidden">{data.date.year}</span>
					<span class="hidden xs:inline">{formatDay(data.date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	{#key `${data.date}`}
		<Notebook {data} />
	{/key}
{/if}

{#snippet nav()}
	<nav>
		<Button variant="ghost" size="icon" onclick={showMenu} class="-ml-1">
			<Menu class="size-6" />
			<span class="sr-only">Ouvrir le menu</span>
		</Button>
	</nav>
{/snippet}
