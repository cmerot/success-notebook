<!-- src/routes/entries/+page.svelte -->
<script lang="ts">
	import { clearStore, dumpStore, importStore } from '$lib/stores/backend-store';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Trash, Upload } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';
	import { today } from '$lib/utils/date';
	import { getFileOperationsAdapter } from '$lib/adapters/file-operations';
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';

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

<Header title="Vos données" variant="sidebar" />

<Surface.Root class="theme-blue">
	<Surface.Header title="Télécharger" />

	<Surface.Section class="text-muted-foreground">
		<p class="mb-3">
			Téléchargez votre carnet au format <code>json</code>.
		</p>
		<p>
			<Button onclick={downloadData}>Télécharger <Download /></Button>
		</p>
	</Surface.Section>
</Surface.Root>

<Surface.Root class="theme-blue">
	<Surface.Header title="Importer" />

	<Surface.Section class="text-muted-foreground">
		<p class="mb-3">
			Importez votre carnet au format <code>json</code>.
		</p>
		<p>
			<Button onclick={importData}>Importer un fichier<Upload /></Button>
		</p>
	</Surface.Section>
</Surface.Root>

<Surface.Root class="theme-rose">
	<Surface.Header title="Supprimer" />

	<Surface.Section class="text-muted-foreground">
		<p class="mb-3">Supprimez votre carnet de ce périphérique.</p>
		<p>
			<Button variant="destructive" onclick={clearData}>Tout supprimer <Trash /></Button>
		</p>
	</Surface.Section>
</Surface.Root>
