<!-- src/routes/entries/+page.svelte -->
<script lang="ts">
	import { clearStore, dumpStore, importStore } from '$lib/services/store';
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
	<Surface.Header title="Gestion de vos données" />

	<Surface.Section>
		<div class="prose prose-sm mb-6 max-w-none text-muted-foreground">
			<p class="mb-2">
				Cette application utilise une base de données locale. Aucune communication n'est effectuée
				avec le monde extérieur : pas de sauvegarde cloud, pas de tracking, pas de collecte de
				données.
			</p>
			<p>
				Vos données restent sur votre appareil. Vous pouvez les télécharger, les importer ou les
				supprimer à tout moment.
			</p>
		</div>

		<div class="space-y-12">
			<div>
				<h3 class="mb-2 font-semibold text-primary">Sauvegarde</h3>
				<p class="mb-3 text-sm">
					Téléchargez votre carnet au format <code>json</code>.
				</p>
				<Button onclick={downloadData}><Download /> Télécharger</Button>
			</div>

			<div>
				<h3 class="mb-2 font-semibold text-primary">Restauration</h3>
				<p class="mb-3 text-sm">
					Importez votre carnet au format <code>json</code>.
				</p>
				<Button onclick={importData}><Upload /> Importer un fichier</Button>
			</div>

			<div>
				<h3 class="mb-2 font-semibold text-destructive">Réinitialisation</h3>
				<p class="mb-3 text-sm">Supprimez votre carnet de ce périphérique.</p>
				<Button variant="destructive" onclick={clearData}><Trash /> Tout supprimer</Button>
			</div>
		</div>
	</Surface.Section>
</Surface.Root>
