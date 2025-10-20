<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { Notebook, DayForm, MonthForm, WeekForm } from '$lib/components/notebook';
	import { formatDay, formatMonth, formatWeek } from '$lib/utils-date';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	let { data }: PageProps = $props();
	let { date } = data;

	let dateIsToday = $derived(date.compare(today(getLocalTimeZone())) === 0);
	function showMenu() {
		goto('/menu');
	}
</script>

{#if data.period == 'day'}
	<Header title="Mes succès du quotidien {formatDay(date)}" class="theme-blue" />
	<DayForm {data} isEditable />
{:else if data.period == 'week'}
	<Header title="Mes succès de la semaine {formatWeek(date)}" class="theme-rose" />
	<WeekForm {data} isEditable />
{:else if data.period == 'month'}
	<Header title="Mes succès du mois de {formatMonth(date)}" class="theme-green" />
	<MonthForm {data} isEditable />
{:else}
	{#if dateIsToday}
		<Header title="Carnet de succès" variant="sidebar" {nav} />
	{:else}
		<Header title="Carnet de succès du {formatDay(date)}" variant="sidebar" />
	{/if}

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
