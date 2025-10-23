<script lang="ts">
	import { type DayFormType, type MonthFormType, type WeekFormType } from '$lib/schemas';
	import { startOfMonth, startOfWeek, type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { DayForm, WeekForm, MonthForm } from '.';
	import { ArrowRight } from 'lucide-svelte';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isEditMode: boolean;
				url: string;
			};
			week: {
				form: SuperValidated<WeekFormType>;
				isEditMode: boolean;
				url: string;
			};
			month: {
				form: SuperValidated<MonthFormType>;
				isEditMode: boolean;
				url: string;
			};
		};
	}

	let { data }: Props = $props();
</script>

<DayForm {data} bindToTime isEditMode={data.day.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.day.url} class="w-full">Carnet quotidien <ArrowRight /></Button>
	{/snippet}
</DayForm>

<WeekForm {data} bindToTime isEditMode={data.week.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.week.url} class="w-full">Carnet hebdo <ArrowRight /></Button>
	{/snippet}
</WeekForm>

<MonthForm {data} bindToTime isEditMode={data.month.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.month.url} class="w-full">Carnet mensuel <ArrowRight /></Button>
	{/snippet}
</MonthForm>
