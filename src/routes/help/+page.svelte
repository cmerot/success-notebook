<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import * as Surface from '$lib/components/surface';
	import { Sun, Calendar, TrendingUp, Pencil } from 'lucide-svelte';
</script>

<Header title="Aide" variant="sidebar" />

<!-- Help Surface -->
<Surface.Root class="theme-purple">
	<Surface.Header title="Comment utiliser votre carnet de succès" />

	<Surface.Section class="prose prose-sm max-w-none text-muted-foreground">
		<h3 class="text-primary">🎯 Votre page d'accueil</h3>
		<p>
			Quand vous ouvrez l'application, vous arrivez sur votre <span
				class="font-semibold text-primary">carnet de succès</span
			> du jour. Cette page vous présente les sections à compléter selon le moment de la journée, de
			la semaine et du mois :
		</p>

		<ul>
			<li>
				<span class="font-semibold text-primary">Chaque matin</span> : Commencez votre journée en notant
				votre humeur, ce pour quoi vous êtes reconnaissant·e, et vos objectifs du jour
			</li>
			<li>
				<span class="font-semibold text-primary">Chaque soir</span> : Terminez en célébrant vos réussites
				et en notant votre état d'esprit
			</li>
			<li>
				<span class="font-semibold text-primary">Lundi matin</span> : Définissez vos objectifs et routines
				de la semaine
			</li>
			<li>
				<span class="font-semibold text-primary">Dimanche soir</span> : Faites le bilan de votre semaine
			</li>
			<li>
				<span class="font-semibold text-primary">1er jour du mois</span> : Définissez vos objectifs mensuels
			</li>
			<li>
				<span class="font-semibold text-primary">Dernier jour du mois</span> : Célébrez vos accomplissements
				du mois
			</li>
		</ul>

		<h3 class="text-primary">📅 Navigation par date</h3>
		<p>
			Vous pouvez naviguer dans le temps pour consulter ou compléter vos carnets passés. Utilisez le
			sélecteur de date en haut de la page d'accueil pour voyager à n'importe quelle date et
			retrouver le carnet de succès correspondant.
		</p>

		<h3 class="text-primary">📝 Les trois niveaux de votre carnet</h3>

		<div class="space-y-4">
			<div class="rounded-lg border border-primary/20 p-4">
				<h4 class="mb-2 flex items-center gap-2 text-primary">
					<Sun class="size-5" />
					Quotidien
				</h4>
				<p class="mb-0">
					<span class="font-semibold text-primary">Matin :</span> Humeur, gratitude, intention du
					jour, tâches à accomplir
					<br />
					<span class="font-semibold text-primary">Soir :</span> Bilan, réussites, humeur du soir
				</p>
			</div>

			<div class="rounded-lg border border-primary/20 p-4">
				<h4 class="mb-2 flex items-center gap-2 text-primary">
					<Calendar class="size-5" />
					Hebdomadaire
				</h4>
				<p class="mb-0">
					<span class="font-semibold text-primary">Lundi :</span> Mantra de la semaine, objectifs
					SMARTE, routines
					<br />
					<span class="font-semibold text-primary">Dimanche :</span> Fiertés et réussites de la semaine
				</p>
			</div>

			<div class="rounded-lg border border-primary/20 p-4">
				<h4 class="mb-2 flex items-center gap-2 text-primary">
					<TrendingUp class="size-5" />
					Mensuel
				</h4>
				<p class="mb-0">
					<span class="font-semibold text-primary">1er jour :</span> Mantra du mois, objectifs
					SMARTE, nouvelles routines
					<br />
					<span class="font-semibold text-primary">Dernier jour :</span> Accomplissements et fiertés
					du mois
				</p>
			</div>
		</div>

		<h3 class="text-primary">💡 Conseils d'utilisation</h3>
		<ul>
			<li>
				<span class="font-semibold text-primary">Soyez régulier·ère</span> : Prenez 5 minutes matin et
				soir pour compléter votre carnet
			</li>
			<li>
				<span class="font-semibold text-primary">Soyez authentique</span> : Notez vraiment ce que vous
				ressentez et vivez, sans jugement
			</li>
			<li>
				<span class="font-semibold text-primary">Célébrez vos victoires</span> : Même les petites réussites
				méritent d'être notées
			</li>
			<li>
				<span class="font-semibold text-primary">Relisez-vous</span> : Parcourez vos carnets passés pour
				mesurer votre progression
			</li>
		</ul>

		<h3 class="text-primary">✏️ Mode édition</h3>
		<p class="mb-0">
			Cliquez sur l'icône crayon <Pencil class="inline-block size-4" /> en haut à droite pour passer
			en mode édition et compléter ou modifier vos entrées. Vos modifications sont automatiquement sauvegardées.
		</p>
	</Surface.Section>
</Surface.Root>
