<script lang="ts" generics="T extends z.ZodObject<any>">
	import type { FsSuperForm } from 'formsnap';
	import { z } from 'zod';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		form: FsSuperForm<InferredType>;
		class?: string;
		open?: boolean;
	};

	type InferredType = z.infer<T>;

	let { form, class: className, open = $bindable() }: Props = $props();
	const { allErrors } = form;
</script>

<div class={className}>
	{#if $allErrors.length > 0}
		<div>
			<h3 class="font-semibold">Erreur(s) dans le formulaire !</h3>
			<p>Le carnet n'a pas pu être enregistré car les données ne sont pas valides.</p>
			<ul class="m-4 w-full list-disc space-y-1 text-sm text-red-600">
				{#each $allErrors as error}
					<li class="ml-8">{error.path}: {error.messages.join('. ')}</li>
				{/each}
			</ul>
		</div>
	{:else}
		<div>
			<h3 class="font-semibold">Tout va bien !</h3>
			<p>Vous verrez ici les erreurs si il y a un problème d'enregistrement des données.</p>
			<p class="my-2">
				<strong class="font-semibold">Explications :</strong> le formulaire s'auto-enregistre à
				interval régulier, c'est très rapide et vous pouvez voir clignoter le témoin
				<span class="relative inline-flex size-3">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"
					>
					</span>
					<span class="relative inline-flex size-3 rounded-full bg-sky-400"> </span>
				</span>. <br />
				Si il clignote pendant plus d'une seconde, c'est qu'il y a un problème. Cliquez dessus pour en
				connaître les raisons.
			</p>
		</div>
	{/if}
	<p><Button onclick={() => (open = false)}>Fermer</Button></p>
</div>
