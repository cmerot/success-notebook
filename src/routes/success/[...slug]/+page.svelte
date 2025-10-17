<script lang="ts">
	import type { PageProps } from './$types';
	import { DayForm, WeekForm, MonthForm } from '$lib/components/forms';

	let { data }: PageProps = $props();

	let { date } = data;
</script>

{#if data.period == 'day'}
	<DayForm {date} data={data.day} />
{:else if data.period == 'week'}
	<WeekForm {date} data={data.week} />
{:else}
	<MonthForm {date} data={data.month} />
{/if}
