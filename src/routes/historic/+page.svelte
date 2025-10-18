<!-- src/routes/entries/+page.svelte -->
<script lang="ts">
	import { clearStore, dumpStore } from '$lib/stores/backend-store';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Trash } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import { formatDayLong, formatMonth, formatWeekLong } from '$lib/utils-date';
	import { getFileOperationsAdapter } from '$lib/adapters/file-operations';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import Header from '$lib/components/layout/header.svelte';

	let { data }: PageProps = $props();

	function clearData() {
		(async () => {
			const fileOps = await getFileOperationsAdapter();
			const confirmation = await fileOps.confirm(
				'Cette action est irréversible. Toujours ok ?',
				{
					title: 'Suppression définitive des données',
					kind: 'warning'
				}
			);
			if (!confirmation) return;
			await clearStore();
			invalidateAll();
		})();
	}

	function downloadData() {
		(async () => {
			const fileOps = await getFileOperationsAdapter();
			const entries = await dumpStore();
			const json = JSON.stringify(entries, null, 2);
			const path = await fileOps.showSaveDialog({
				filters: [
					{
						name: 'JSON',
						extensions: ['json']
					}
				],
				defaultPath: `success-notebook-${today(getLocalTimeZone()).toString()}.json`
			});
			if (path) {
				await fileOps.writeTextFile(path, json);
			}
		})();
	}
</script>

<Header title="Historique" variant="sidebar" />

<div class="space-y-8 p-3">
	<p>
		<Button onclick={downloadData}>Tout télécharger <Download /></Button>
		<Button variant="destructive" onclick={clearData}>Tout supprimer <Trash /></Button>
	</p>
	<ul>
		{#each data.entries as entry}
			<li>
				{#if entry.type == 'day'}
					<Button class="ml-8 capitalize" variant="link" href="/success/{entry.url}">
						{formatDayLong(entry.date)}
					</Button>
				{:else if entry.type == 'week'}
					<Button class="ml-4 text-lg capitalize" variant="link" href="/success/{entry.url}">
						{formatWeekLong(entry.date)}
					</Button>
				{:else}
					<Button class="text-xl capitalize" variant="link" href="/success/{entry.url}">
						{formatMonth(entry.date)}
					</Button>
				{/if}
			</li>
		{/each}
	</ul>
</div>
