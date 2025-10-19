<script lang="ts">
	import { type DayFormType, type MonthFormType, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Header from '$lib/components/layout/header.svelte';
	import { DayForm, MonthForm, WeekForm } from '$lib/components/demo';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';

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

	function showMenu() {
		goto('/menu');
	}
</script>

<Header title="Carnet de succès" variant="sidebar">
	{#snippet nav()}
		<nav>
			<Button variant="ghost" size="icon" onclick={showMenu} class="-ml-1">
				<Menu class="size-6" />
				<span class="sr-only">Ouvrir le menu</span>
			</Button>
		</nav>
	{/snippet}
</Header>

<DayForm {data}>
	{#snippet footer()}
		<Button href={dayHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</DayForm>

<WeekForm {data}>
	{#snippet footer()}
		<Button href={weekHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</WeekForm>

<MonthForm {data}>
	{#snippet footer()}
		<Button href={monthHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</MonthForm>
