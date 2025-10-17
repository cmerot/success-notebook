<script lang="ts">
	import type { PageProps } from './$types';
	import { DayForm, WeekForm, MonthForm } from '$lib/components/forms';

	let { data }: PageProps = $props();
</script>

{#if data.period == 'day'}
	<DayForm data={{ date: data.date, ...data.day }} />
{:else if data.period == 'week'}
	<WeekForm data={{ date: data.date, ...data.week }} />
{:else}
	<MonthForm data={{ date: data.date, ...data.month }} />
{/if}
