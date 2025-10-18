<script lang="ts">
	import { type DayFormType, type MonthFormType, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Header from '$lib/components/layout/header.svelte';
	import { DayForm, MonthForm, WeekForm } from '$lib/components/demo';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isNew: boolean;
			};
			week: {
				form: SuperValidated<WeekFormType>;
				isNew: boolean;
			};
			month: {
				form: SuperValidated<MonthFormType>;
				isNew: boolean;
			};
		};
	}

	let { data }: Props = $props();

	let { date } = data;
	const dayHref = ['demo', date.year, date.month, date.day, 'day'].join('/');
	const weekHref = ['demo', date.year, date.month, date.day, 'week'].join('/');
	const monthHref = ['demo', date.year, date.month, date.day, 'month'].join('/');
</script>

<Header title="Demo" variant="sidebar" />

<DayForm {data} />
<Button href={dayHref} class="w-full">Ouvrir →</Button>
<WeekForm {data} />
<Button href={weekHref} class="w-full">Ouvrir →</Button>
<MonthForm {data} />
<Button href={monthHref} class="w-full">Ouvrir →</Button>
