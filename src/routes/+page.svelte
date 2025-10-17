<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/layout/header.svelte';
	import type { PageProps } from './$types';
	import { formatDayLong } from '$lib/utils-date';
	import Check from '@lucide/svelte/icons/check';
	import { Separator } from '$lib/components/separator';

	let { data }: PageProps = $props();

	const date = data.date;
	const [year, month, day] = date.toString().split('-');

	const dayURL = ['success', year, month, day, 'day'].join('/');
	const weekURL = ['success', year, month, day, 'week'].join('/');
	const monthURL = ['success', year, month, day, 'month'].join('/');

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

<Separator class="from-background to-blue-600" />

<!-- Day Card -->
<a href={dayURL} class="group block">
	<Card.Root class="theme-blue rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">
						{#if data.dayEntry?.start.mood.icon}
							{data.dayEntry.start.mood.icon}
						{:else}
							☀️
						{/if}
					</div>
					<div class="text-xl text-primary">{formatDayLong(date)}</div>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if data.dayEntry?.start.todoList.length || data.dayEntry?.start.toRelaxList.length}
				<div class="mb-2 space-y-4 rounded-2xl bg-background p-4">
					{#if data.dayEntry?.start.todoList.length}
						<div>
							<h3 class="font-semibold text-primary">To Do</h3>
							<ul>
								{#each data.dayEntry.start.todoList as todo}
									<li class="py-1">
										<Check class="inline {todo.completed ? '' : 'text-muted'}" />
										<span class={todo.completed ? 'line-through' : ''}> {todo.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if data.dayEntry?.start.toRelaxList.length}
						<div>
							<h3 class="font-semibold text-primary">To Relax</h3>
							<ul>
								{#each data.dayEntry.start.toRelaxList as todo}
									<li class="py-1">
										<Check class="inline {todo.completed ? '' : 'text-muted'}" />
										<span class={todo.completed ? 'line-through' : ''}> {todo.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
			<h3 class="text-lg font-semibold text-primary">Quotidien</h3>
			Matin et soirée : gratitude, objectifs et réflexions
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</a>

<Separator class="from-blue-600 to-rose-600" />

<!-- Week Card -->
<a href={weekURL} class="group block">
	<Card.Root class="theme-rose rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">📅</div>
					{#if data.weekEntry?.start.mantra}
						<h3 class="text-xl font-semibold italic">
							<q>
								{data.weekEntry.start.mantra}
							</q>
						</h3>
					{/if}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<h3 class="text-lg font-semibold text-primary">Hebdomadaire</h3>
			Lundi au dimanche : routines et objectifs SMARTE
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</a>

<Separator class="from-rose-600 to-lime-600" />

<!-- Month Card -->
<a href={monthURL} class="group block">
	<Card.Root class="theme-green rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">🗓️</div>
					{#if data.monthEntry?.start.mantra}
						<h3 class="text-xl font-semibold italic">
							<q>
								{data.monthEntry.start.mantra}
							</q>
						</h3>
					{/if}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<h3 class="text-lg font-semibold text-primary">Mensuel</h3>
			Premier au dernier jour : nouvelles routines et bilan
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</a>

<Separator class="from-lime-600 to-background" />

<!-- Help Card -->
<Card.Root class="m-4">
	<Card.Header>
		<Card.Title class="text-center text-lg">
			<h2>Comment utiliser votre carnet</h2>
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div class="space-y-4 text-sm text-muted-foreground">
			<div>
				<h3 class="text-base font-semibold">Quotidien</h3>
				<p>Commencez et terminez chaque journée avec gratitude et réflexion</p>
			</div>
			<div>
				<h3 class="text-base font-semibold">Hebdomadaire</h3>
				<p>Planifiez vos routines le lundi et faites le bilan le dimanche</p>
			</div>
			<div>
				<h3 class="text-base font-semibold">Mensuel</h3>
				<p>Définissez vos objectifs SMARTE et célébrez vos réussites</p>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<!-- About Card -->
<Card.Root class="mx-4 mt-14 mb-7">
	<Card.Header>
		<Card.Title class="text-center text-lg">
			<h2>À propos</h2>
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div class="space-y-2 text-sm text-muted-foreground">
			<h3 class="text-base font-semibold">Vos données</h3>
			<p>
				Cette application utilise une base de donnée locale et aucune communication n'est effectuée
				avec le monde extérieur. Pas de sauvegarde cloud ni de tracking.
			</p>
			<p>
				Vous pouvez sauvegarder vos données via l'historique. C'est votre base de données complète
				en un seul fichier JSON.
			</p>
		</div>
		<div class="space-y-4 text-sm text-muted-foreground">
			<h3 class="text-base font-semibold">Cette application</h3>
			<p>
				Cette application est distribuée sous une licence libre, avec son code source disponible sur
				Internet.
			</p>
			<p>
				<a href="/license" class="text-primary underline hover:no-underline">
					Voir la licence MIT
				</a>
			</p>
			<p>
				<a
					href="https://github.com/cmerot/success-notebook"
					class="text-primary underline hover:no-underline"
					target="_blank"
				>
					Voir le code source
				</a>
			</p>
		</div>
	</Card.Content>
</Card.Root>
