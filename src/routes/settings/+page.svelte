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
	import { Emoticon, emoticonThemes } from '$lib/components/form/emoticon';

	let { data }: PageProps = $props();

	let settings: AppSettings = $state(data.settings);
	let hasChanges = $state(false);
	let canReset = $state(false);

	$effect(() => {
		hasChanges = JSON.stringify(settings) !== JSON.stringify(data.settings);
		canReset = hasChanges || JSON.stringify(data.settings) !== JSON.stringify(DEFAULT_SETTINGS);
	});

	async function handleSave() {
		await saveSettings(settings);
		toast.success('Paramètres enregistrés', {
			description: "L'application va redémarrer pour appliquer les changements.",
			duration: 2000
		});
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
			<!-- Général -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Général</h3>
				<div class="space-y-4">
					<Label for="emoticonTheme" class="text-base">Thème des emoticons</Label>
					<div class="flex gap-4">
						{#each Object.entries(emoticonThemes) as [key, theme]}
							<Emoticon
								value={theme[5]}
								onclick={() => {
									settings.emoticonTheme = key as AppSettings['emoticonTheme'];
								}}
								size="sm"
								class="{settings.emoticonTheme === key
									? 'border-2 border-primary'
									: ''} cursor-pointer"
							/>
						{/each}
					</div>
				</div>
			</div>

			<!-- Quotidien -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Quotidien</h3>
				<div class="space-y-4">
					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxTodoList" class="shrink-0 text-base sm:w-80">
							Maximum de tâches à accomplir
						</Label>
						<div class="flex items-center gap-4">
							<Input
								id="maxTodoList"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxTodoList}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxTodoList}
							</span>
						</div>
					</div>

					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxToRelaxList" class="shrink-0 text-base sm:w-80">
							Maximum de moments de détente
						</Label>
						<div class="flex items-center gap-4">
							<Input
								id="maxToRelaxList"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxToRelaxList}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxToRelaxList}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Hebdomadaire -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Hebdomadaire</h3>
				<div class="space-y-4">
					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxWeekRoutines" class="shrink-0 text-base sm:w-80"
							>Maximum de routines</Label
						>
						<div class="flex items-center gap-4">
							<Input
								id="maxWeekRoutines"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxWeekRoutines}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxWeekRoutines}
							</span>
						</div>
					</div>

					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxWeekGoals" class="shrink-0 text-base sm:w-80">Maximum d'objectifs</Label>
						<div class="flex items-center gap-4">
							<Input
								id="maxWeekGoals"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxWeekGoals}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxWeekGoals}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Mensuel -->
			<div>
				<h3 class="mb-4 text-lg font-semibold text-primary">Mensuel</h3>
				<div class="space-y-4">
					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxMonthRoutines" class="shrink-0 text-base sm:w-80"
							>Maximum de routines
						</Label>
						<div class="flex items-center gap-4">
							<Input
								id="maxMonthRoutines"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxMonthRoutines}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxMonthRoutines}
							</span>
						</div>
					</div>

					<div class="sm:flex sm:items-center sm:gap-4">
						<Label for="maxMonthGoals" class="shrink-0 text-base sm:w-80">Maximum d'objectifs</Label
						>
						<div class="flex items-center gap-4">
							<Input
								id="maxMonthGoals"
								type="number"
								min="1"
								max="20"
								bind:value={settings.maxMonthGoals}
								class="w-20"
							/>
							<span class="text-sm text-muted-foreground">
								recommandé: {DEFAULT_SETTINGS.maxMonthGoals}
							</span>
						</div>
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
