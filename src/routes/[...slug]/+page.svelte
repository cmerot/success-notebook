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

	let { data }: PageProps = $props();
	let { date } = data;

	let dateIsToday = $derived(date.compare(today) === 0);
	function showMenu() {
		goto('/menu');
	}
</script>

{#if data.period == 'day'}
	<Header class={dayConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès du quotidien</span>
				<DatePicker class="ml-auto" {date}>
					<span class="xs:hidden">{date.year}</span>
					<span class="hidden xs:inline">{formatDay(date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	<DayForm {data} />
{:else if data.period == 'week'}
	<Header class={weekConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès de la semaine</span>
				<DatePicker class="ml-auto" {date}>
					<span class="xs:hidden">{date.year}</span>
					<span class="hidden xs:inline">{formatWeek(date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>
	<WeekForm {data} />
{:else if data.period == 'month'}
	<Header class={monthConfig.theme}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Succès du mois</span>
				<DatePicker class="ml-auto" {date}>
					<span class="xs:hidden">{date.year}</span>
					<span class="hidden xs:inline">{formatMonth(date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	<MonthForm {data} />
{:else}
	<Header variant="sidebar" nav={dateIsToday ? nav : undefined}>
		{#snippet title()}
			<h2 class="flex w-full items-center">
				<span class="text-xl">Carnet de succès</span>
				<DatePicker class="ml-auto" {date}>
					<span class="xs:hidden">{date.year}</span>
					<span class="hidden xs:inline">{formatDay(date, 'numeric')}</span>
				</DatePicker>
			</h2>
		{/snippet}
	</Header>

	<Notebook {data} />
{/if}

{#snippet nav()}
	<nav>
		<Button variant="ghost" size="icon" onclick={showMenu} class="-ml-1">
			<Menu class="size-6" />
			<span class="sr-only">Ouvrir le menu</span>
		</Button>
	</nav>
{/snippet}
