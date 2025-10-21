<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
</script>

<Header title="Aide et à propos" variant="sidebar" />

<!-- Help Surface -->
<Surface.Root class="theme-purple">
	<Surface.Header title="Comment utiliser votre carnet" />

	<Surface.Section class="prose prose-sm max-w-none text-muted-foreground">
		<h3>Quotidien</h3>
		<p>Commencez et terminez chaque journée avec gratitude et réflexion</p>

		<h3>Hebdomadaire</h3>
		<p>Planifiez vos routines le lundi et faites le bilan le dimanche</p>

		<h3>Mensuel</h3>
		<p class="mb-0">Définissez vos objectifs SMARTE et célébrez vos réussites</p>
	</Surface.Section>
</Surface.Root>

<!-- About Surface -->
<Surface.Root class="theme-teal">
	<Surface.Header title="À propos" />

	<Surface.Section class="prose prose-sm max-w-none text-muted-foreground">
		<h3>Vos données</h3>
		<p>
			Cette application utilise une base de donnée locale et aucune communication n'est effectuée
			avec le monde extérieur. Pas de sauvegarde cloud ni de tracking.
		</p>
		<p>
			Vous pouvez sauvegarder vos données via l'historique. C'est votre base de données complète en
			un seul fichier JSON.
		</p>
		<h3>Cette application</h3>
		<p>
			Cette application est distribuée sous une licence libre, avec son code source disponible sur
			Internet.
		</p>
		<p>
			<a href="/license" class="text-primary underline hover:no-underline"> Voir la licence MIT </a>
		</p>
		<p class="mb-0">
			<a
				href="https://github.com/cmerot/success-notebook"
				class="text-primary underline hover:no-underline"
				target="_blank"
			>
				Voir le code source
			</a>
		</p>
	</Surface.Section>
</Surface.Root>
