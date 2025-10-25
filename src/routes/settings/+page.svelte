<script lang="ts">
	import { saveSettings, DEFAULT_SETTINGS, type AppSettings } from '$lib/services/settings';
	import { reloadApp } from '$lib/utils/app';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Save, RotateCcw } from 'lucide-svelte';
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import { toast } from 'svelte-sonner';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let settings: AppSettings = $state(data.settings);
	let hasChanges = $state(false);
	let canReset = $state(false);

	// Track changes
	$effect(() => {
		hasChanges = JSON.stringify(settings) !== JSON.stringify(data.settings);
		// Can reset if settings are modified OR if loaded settings are not default
		canReset = hasChanges || JSON.stringify(data.settings) !== JSON.stringify(DEFAULT_SETTINGS);
	});

	async function handleSave() {
		await saveSettings(settings);
		toast.success('Paramètres enregistrés', {
			description: "L'application va redémarrer pour appliquer les changements.",
			duration: 2000
		});

		// Recharger après un court délai pour laisser le toast s'afficher
		setTimeout(() => {
			reloadApp();
		}, 2000);
	}

	async function handleReset() {
		settings = { ...DEFAULT_SETTINGS };
	}
</script>

<Header title="Paramètres" variant="sidebar" />

<Surface.Root class="theme-blue">
	<Surface.Header title="Configuration de l'application" />

	<Surface.Section>
		<div class="prose prose-sm mb-6 max-w-none text-muted-foreground">
			<p class="mb-2 text-lg">
				Personnalisez les limites des listes dans votre carnet. Les valeurs recommandées sont
				optimales pour une utilisation quotidienne.
			</p>
			<p class="italic">
				Note : L'application redémarrera automatiquement après l'enregistrement pour appliquer les
				nouveaux paramètres.
			</p>
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSave();
			}}
			class="space-y-8"
		>
			<!-- Paramètres quotidiens -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Quotidien</h3>
				<div class="space-y-4">
					<div class="grid gap-2">
						<Label for="maxTodoList" class="text-base">
							Maximum de tâches à accomplir
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxTodoList})
							</span>
						</Label>
						<Input
							id="maxTodoList"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxTodoList}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="maxToRelaxList" class="text-base">
							Maximum de moments de détente
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxToRelaxList})
							</span>
						</Label>
						<Input
							id="maxToRelaxList"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxToRelaxList}
						/>
					</div>
				</div>
			</div>

			<!-- Paramètres hebdomadaires -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Hebdomadaire</h3>
				<div class="space-y-4">
					<div class="grid gap-2">
						<Label for="maxWeekRoutines" class="text-base">
							Maximum de routines
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxWeekRoutines})
							</span>
						</Label>
						<Input
							id="maxWeekRoutines"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxWeekRoutines}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="maxWeekGoals" class="text-base">
							Maximum d'objectifs
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxWeekGoals})
							</span>
						</Label>
						<Input
							id="maxWeekGoals"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxWeekGoals}
						/>
					</div>
				</div>
			</div>

			<!-- Paramètres mensuels -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Mensuel</h3>
				<div class="space-y-4">
					<div class="grid gap-2">
						<Label for="maxMonthRoutines" class="text-base">
							Maximum de routines
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxMonthRoutines})
							</span>
						</Label>
						<Input
							id="maxMonthRoutines"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxMonthRoutines}
						/>
					</div>

					<div class="grid gap-2">
						<Label for="maxMonthGoals" class="text-base">
							Maximum d'objectifs
							<span class="text-sm font-normal text-muted-foreground">
								(recommandé: {DEFAULT_SETTINGS.maxMonthGoals})
							</span>
						</Label>
						<Input
							id="maxMonthGoals"
							type="number"
							min="1"
							max="20"
							bind:value={settings.maxMonthGoals}
						/>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4">
				<Button type="submit" disabled={!hasChanges}>
					<Save /> Enregistrer et Recharger
				</Button>
				<Button type="button" variant="outline" onclick={handleReset} disabled={!canReset}>
					<RotateCcw /> Réinitialiser
				</Button>
			</div>
		</form>
	</Surface.Section>
</Surface.Root>
