<!-- src/routes/entries/+page.svelte -->
<script lang="ts">
	import { clearStore, dumpStore, importStore } from '$lib/stores/backend-store';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Trash, Upload } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import {
		formatDay,
		formatDayLong,
		formatMonth,
		formatWeek,
		formatWeekLong,
		today
	} from '$lib/utils/date';
	import { getFileOperationsAdapter } from '$lib/adapters/file-operations';
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	function clearData() {
		(async () => {
			const fileOps = await getFileOperationsAdapter();
			const confirmation = await fileOps.confirm('Cette action est irréversible. Toujours ok ?', {
				title: 'Suppression définitive des données',
				kind: 'warning'
			});
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
				defaultPath: `success-notebook-${today.toString()}.json`
			});
			if (path) {
				await fileOps.writeTextFile(path, json);
			}
		})();
	}

	function importData() {
		(async () => {
			const fileOps = await getFileOperationsAdapter();
			const path = await fileOps.showOpenDialog({
				filters: [
					{
						name: 'JSON',
						extensions: ['json']
					}
				],
				multiple: false
			});

			if (path && path.length > 0) {
				try {
					const content = await fileOps.readTextFile(path[0]);
					const entries = JSON.parse(content);

					if (!Array.isArray(entries)) {
						await fileOps.alert('Le fichier ne contient pas un format valide.', {
							title: "Erreur d'importation",
							kind: 'error'
						});
						return;
					}

					const result = await importStore(entries);

					await fileOps.alert(
						`Importation terminée:\n- ${result.imported} nouvelles entrées\n- ${result.merged} entrées fusionnées\n- ${result.skipped} entrées ignorées`,
						{
							title: 'Importation réussie',
							kind: 'info'
						}
					);

					invalidateAll();
				} catch (error) {
					await fileOps.alert(`Erreur lors de l'importation: ${error}`, {
						title: "Erreur d'importation",
						kind: 'error'
					});
				}
			}
		})();
	}
</script>

<Header title="Historique" variant="sidebar" />

<Surface.Root class="theme-blue">
	<Surface.Section>
		<ul class="">
			{#each data.entries as entry}
				<li>
					{#if entry.type == 'day'}
						<Button class="capitalize" variant="link" href={resolve(`/${entry.url}`)}>
							{formatDay(entry.date, { size: 'lg' })}
						</Button>
					{:else if entry.type == 'week'}
						<h3>
							<Button class="text-xl capitalize" variant="link" href={resolve(`/${entry.url}`)}>
								{formatWeek(entry.date, { size: 'lg' })}
							</Button>
						</h3>
					{:else}
						<h1>
							<Button class="text-3xl capitalize" variant="link" href={resolve(`/${entry.url}`)}>
								{formatMonth(entry.date, { size: 'lg' })}
							</Button>
						</h1>
					{/if}
				</li>
			{/each}
		</ul>
	</Surface.Section>
</Surface.Root>
