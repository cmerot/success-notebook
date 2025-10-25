<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import { resolve } from '$app/paths';
</script>

<Header title="À propos" variant="sidebar" />

<!-- About Surface -->
<Surface.Root class="theme-teal">
	<Surface.Header title="À propos" />

	<Surface.Section class="prose prose-sm max-w-none text-muted-foreground">
		<h3 class="text-primary">Le carnet de succès</h3>
		<p>
			Ce journal de développement personnel s'inspire du concept de "carnet de succès" enseigné
			par Julien DIEU dans sa formation "Gestion du temps", basée sur le principe que le bien-être
			est le socle d'une performance durable.
		</p>
		<div class="flex items-center gap-4">
			<a
				href="https://lineupcoaching.fr/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block"
			>
				<img
					src="/logo-lineupcoaching/logo.png"
					alt="Line Up Coaching"
					class="h-12 w-auto"
				/>
			</a>
			<a
				href="https://lineupcoaching.fr/"
				class="text-primary underline hover:no-underline"
				target="_blank"
				rel="noopener noreferrer"
			>
				Découvrir Line Up Coaching
			</a>
		</div>

		<h3 class="text-primary">Protection de vos données</h3>
		<p>
			Cette application utilise une base de données locale. Aucune communication n'est effectuée
			avec le monde extérieur : pas de sauvegarde cloud, pas de tracking, pas de collecte de
			données.
		</p>
		<p>
			Vous pouvez sauvegarder vos données via l'historique. C'est votre base de données complète en
			un seul fichier JSON que vous contrôlez entièrement.
		</p>

		<h3 class="text-primary">Licence et code source</h3>
		<p>
			Cette application est un logiciel libre distribué sous
			<a href={resolve('/license')} class="text-primary underline hover:no-underline">
				licence MIT
			</a>, avec son code source disponible publiquement.
		</p>
		<p>
			<a
				href="https://github.com/cmerot/success-notebook"
				class="text-primary underline hover:no-underline"
				target="_blank"
				rel="noopener noreferrer"
			>
				Voir le code source sur GitHub
			</a>
		</p>

		<h3 class="text-primary">Développement</h3>
		<p class="mb-0">
			Cette application a été développée par Corentin Merot.
		</p>
		<p class="mb-0">
			<a
				href="https://github.com/cmerot"
				class="text-primary underline hover:no-underline"
				target="_blank"
				rel="noopener noreferrer"
			>
				github.com/cmerot
			</a>
		</p>
	</Surface.Section>
</Surface.Root>
