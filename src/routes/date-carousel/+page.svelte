<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import DateCarousel from '$lib/components/date-carousel/date-carousel.svelte';
	import { title } from '$lib/stores/frontend-store';
	import { formatDayLong } from '$lib/utils-date';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
</script>

<Header title={formatDayLong($title)} variant="sidebar" />

<div class="bg-primary/10">
	<h2 class="px-4 pt-4 text-2xl font-semibold"><q class="italic">Le choix dans la date</q></h2>
	<h3 class="px-4 text-xl text-muted-foreground">Swipe swag demo</h3>
</div>

<Separator class="border-none bg-gradient-to-b from-primary to-background py-14 opacity-10" />

<div class="bg-background">
	<DateCarousel />
</div>

<Separator class="border-none bg-gradient-to-b from-background to-primary py-14 opacity-10" />

<div class="bg-primary/10">
	<!-- Help Card -->
	<Card.Root class="mx-4 border-none bg-transparent shadow-none">
		<Card.Header>
			<Card.Title class="text-center text-lg">
				<h2>À propos</h2>
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-6 p-0">
			<div class="space-y-4 text-sm text-muted-foreground">
				<div class="space-y-3">
					<h3 class="mb-1 text-base font-semibold">Qu'est-ce que c'est ?</h3>

					<p>
						C'est un carousel infini : on peut faire défiler les dates à gauche et à droite. Les
						jours, semaines et mois sont synchronisés.
					</p>
					<p>Chaque date est cliquable et permet de réveler <strong>une surprise.</strong></p>
				</div>
				<div class="space-y-3">
					<h3 class="mb-1 text-base font-semibold">Comment ça marche ?</h3>
					<p>
						Chaque carousel a un nombre de slides limitée, par exemple un <em>jour</em> a 35 slides de
						chaque côtés et on voit le slide du milieu. Ce carousel a donc 71 slides en tout.
					</p>
					<p>
						La fenêtre est grande pour que lorsque l'on change de mois on puisse voir défiler les
						jours également.
					</p>
					<p>Exemple avec un fenêtre de 5 slides :</p>
					<pre class="w-full overflow-x-auto">
1. État initial:

   [-2] [-1] [0] [+1] [+2]
              ^
         Slide visible


2. L'utilisateur swipe à droite:

   [-2] [-1] [0] [+1 - Sélection] [+2]
                       ^
                   Slide visible

   Si l'utilisateur n'attends pas l'étape 3, 
   alors il ne peut swipper que de 1 vers la
   droite, il n'y a plus de slide en réserve.


3. Après la fin de l'animation:

   [-1] [0] [1] [+2] [+3]
             ^
        Slide visible

   Le slide [-2] a été supprimé et le slide
   [+3] a été créé.
				</pre>
					<p></p>
				</div>
				<div class="space-y-3">
					<h3 class="mb-1 text-base font-semibold">Limites</h3>
					<p>
						Les slides sont regénérés à chaque fin d'animation, cela implique que si on fait défiler
						trop vite, ça ne marche pas et <strong>
							on observe un saut : il n'y a pas de transition.
						</strong>
					</p>
					<p>
						Et surtout : si le composant du slide est complexe et que la fenêtre est grande, <strong
						>
							ça fait beaucoup de travail pour le rendu.
						</strong>
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
