<!-- src/routes/entries/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageProps } from './$types';
	import { formatDay, formatMonth, formatWeek, buildHierarchicalEntries } from '$lib/utils/date';
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	// Create hierarchical structure: months -> weeks -> days
	const hierarchicalEntries = $derived(buildHierarchicalEntries(data.entries));
</script>

<Header title="Historique" variant="sidebar" />

<Surface.Root class="theme-blue">
	<Surface.Section>
		<ul class="">
			{#each hierarchicalEntries as month}
				<li>
					<!-- Month header -->
					<h1>
						<Button
							class="text-3xl capitalize"
							variant="link"
							href={month.hasEntry
								? resolve(`/${month.date.year}/${month.date.month}/${month.date.day}/month`)
								: ''}
							disabled={!month.hasEntry}
						>
							{formatMonth(month.date, { size: 'lg' })}
						</Button>
					</h1>

					<!-- Weeks in this month -->
					<ul class="ml-4">
						{#each month.weeks as week}
							<li>
								<!-- Week header -->
								<h3>
									<Button
										class="text-xl capitalize"
										variant="link"
										href={week.hasEntry
											? resolve(`/${week.date.year}/${week.date.month}/${week.date.day}/week`)
											: ''}
										disabled={!week.hasEntry}
									>
										{formatWeek(week.date, { size: 'lg' })}
									</Button>
								</h3>

								<!-- Days in this week -->
								<ul class="ml-4">
									{#each week.days as day}
										<li>
											<Button
												class="capitalize"
												variant="link"
												href={resolve(`/${day.date.year}/${day.date.month}/${day.date.day}`)}
											>
												{formatDay(day.date, { size: 'lg' })}
											</Button>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</Surface.Section>
</Surface.Root>
