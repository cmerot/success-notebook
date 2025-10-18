<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import EditableTextBare from '$lib/components/form/text/editable-text-bare.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import type { RoutineItemSchemaType } from '$lib/schemas/week-form-schema.js';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode: boolean;
		onBlur?: () => void;
	}

	let { form, name, isEditMode, onBlur }: Props = $props();

	const routine = fieldProxy(form.form, name) as unknown as Writable<RoutineItemSchemaType>;

	const weekDays = [
		{ key: 'monday', label: 'Lun', fullLabel: 'Lundi' },
		{ key: 'tuesday', label: 'Mar', fullLabel: 'Mardi' },
		{ key: 'wednesday', label: 'Mer', fullLabel: 'Mercredi' },
		{ key: 'thursday', label: 'Jeu', fullLabel: 'Jeudi' },
		{ key: 'friday', label: 'Ven', fullLabel: 'Vendredi' },
		{ key: 'saturday', label: 'Sam', fullLabel: 'Samedi' },
		{ key: 'sunday', label: 'Dim', fullLabel: 'Dimanche' }
	] as const;

	function toggleDay(day: Exclude<keyof RoutineItemSchemaType, 'text'>) {
		$routine[day] = !$routine[day];
	}
</script>

{#if isEditMode || $routine.text}
	<Form.Control>
		{#snippet children({ props })}
			<div
				class={cn('space-y-2 rounded-lg px-3 py-2', {
					'transition-colors hover:bg-accent': isEditMode
				})}
			>
				<EditableTextBare
					{isEditMode}
					bind:value={$routine.text}
					placeholder="Nouvelle routine..."
					{onBlur}
					formProps={isEditMode ? props : {}}
					inputClass="block min-h-[1.25rem] w-full leading-5"
					viewClass="block min-h-[1.25rem] text-left leading-5 text-foreground"
					emptyText=""
				/>
				<div class="flex flex-wrap gap-1.5">
					{#each weekDays as day}
						<button
							type="button"
							onclick={() => toggleDay(day.key)}
							disabled={!$routine.text}
							class="transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
							title={day.fullLabel}
						>
							<Badge variant={$routine[day.key] ? 'default' : 'outline'}>
								{day.label}
							</Badge>
						</button>
					{/each}
				</div>
			</div>
		{/snippet}
	</Form.Control>
{/if}
