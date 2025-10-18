<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { DayForm, MonthForm, WeekForm } from '$lib/components/demo';
	import { formatDay, formatMonth, formatWeek } from '$lib/utils-date';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let { date } = data;
</script>

{#if data.period == 'day'}
	<Header title="Mes succès du quotidien {formatDay(date)}" class="theme-blue" />
	<DayForm {data} />
{:else if data.period == 'week'}
	<Header title="Mes succès de la semaine {formatWeek(date)}" class="theme-rose" />
	<WeekForm {data} />
{:else}
	<Header title="Mes succès du mois {formatMonth(date)}" class="theme-green" />
	<MonthForm {data} />
{/if}
