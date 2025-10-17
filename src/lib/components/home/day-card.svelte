<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { formatDayLong } from '$lib/utils-date';
	import Check from '@lucide/svelte/icons/check';
	import type { CalendarDate } from '@internationalized/date';
	import type { DayFormType } from '$lib/schemas';

	interface Props {
		dayURL: string;
		dayEntry: DayFormType | null;
		date: CalendarDate;
	}

	let { dayURL, dayEntry, date }: Props = $props();
</script>

<!-- Day Card -->
<a href={dayURL} class="group block">
	<Card.Root class="theme-blue rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">
						{#if dayEntry?.start.mood.icon}
							{dayEntry.start.mood.icon}
						{:else}
							☀️
						{/if}
					</div>
					<div class="text-xl text-primary">{formatDayLong(date)}</div>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if dayEntry?.start.todoList.length || dayEntry?.start.toRelaxList.length}
				<div class="mb-2 space-y-4 rounded-2xl bg-background p-4">
					{#if dayEntry?.start.todoList.length}
						<div>
							<h3 class="font-semibold text-primary">To Do</h3>
							<ul>
								{#each dayEntry.start.todoList as todo}
									<li class="py-1">
										<Check class="inline {todo.completed ? '' : 'text-muted'}" />
										<span class={todo.completed ? 'line-through' : ''}> {todo.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if dayEntry?.start.toRelaxList.length}
						<div>
							<h3 class="font-semibold text-primary">To Relax</h3>
							<ul>
								{#each dayEntry.start.toRelaxList as todo}
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
