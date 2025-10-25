import { TextField, TextFieldset } from '$lib/components/form/text';
import { TodoFieldset } from '$lib/components/form/todo';
import { GoalFieldset } from '$lib/components/form/goal';
import { RoutineFieldset } from '$lib/components/form/routine';
import { Calendar1, CalendarCheck, Moon, Sun } from 'lucide-svelte';
import MoodFieldset from '$lib/components/form/mood/mood-fieldset.svelte';
import type { FormConfig } from '$lib/types/form';
import type { AppSettings } from '$lib/services/settings';

export function createDayConfig(settings: AppSettings): FormConfig {
	return {
		theme: 'theme-teal',
		emoji: '😊',
		sections: {
			start: {
				title: 'Matin',
				icon: Sun,
				fields: [
					{
						name: 'morningMood',
						path: 'start.mood',
						component: MoodFieldset,
						legend: 'Émotion(s) du matin',
						placeholder: 'Comment vous sentez-vous ce matin ?'
					},
					{
						name: 'grateful',
						path: 'start.grateful',
						component: TextField,
						label: 'Je suis reconnaissant·e pour',
						placeholder: "Ce qui vous rend heureux·se aujourd'hui..."
					},
					{
						name: 'desire',
						path: 'start.desire',
						component: TextField,
						label: "J'attends avec impatience",
						placeholder: 'Ce moment, cette activité que vous anticipez...'
					},
					{
						name: 'goal',
						path: 'start.goal',
						component: TextField,
						label: 'Je serais satisfait·e de ma journée si',
						placeholder: "Votre objectif principal pour aujourd'hui..."
					},
					{
						name: 'todoList',
						path: 'start.todoList',
						component: TodoFieldset,
						legend: 'To Do List',
						placeholder: 'Une tâche à accomplir...',
						maxItems: settings.maxTodoList
					},
					{
						name: 'toRelaxList',
						path: 'start.toRelaxList',
						component: TodoFieldset,
						legend: 'To Relax List',
						placeholder: 'Une activité relaxante...',
						maxItems: settings.maxToRelaxList
					}
				]
			},
			end: {
				title: 'Soirée',
				icon: Moon,
				fields: [
					{
						name: 'achievements',
						path: 'end.achievements',
						component: TextField,
						label: "Les choses formidables vécues aujourd'hui + mes réussites",
						placeholder: "Vos succès, petits et grands, d'aujourd'hui..."
					},
					{
						name: 'eveningMood',
						path: 'end.mood',
						component: MoodFieldset,
						legend: 'Émotion(s) du soir',
						placeholder: 'Comment terminez-vous cette journée ?'
					}
				]
			}
		},
		emptyState: {
			title: 'Quotidien',
			start: 'Matin : humeur, réflexion et chose à faire',
			end: 'Soir : humeur et bilan'
		}
	};
}

export function createWeekConfig(settings: AppSettings): FormConfig {
	return {
		theme: 'theme-sky',
		emoji: '🗓️',
		sections: {
			start: {
				title: 'Lundi matin',
				icon: Sun,
				fields: [
					{
						name: 'mantra',
						path: 'start.mantra',
						component: TextField,
						label: 'Mon mantra de la semaine',
						placeholder: 'Une phrase inspirante pour guider votre semaine...'
					},
					{
						name: 'goals',
						path: 'start.goals',
						component: GoalFieldset,
						legend: 'Mes objectifs (SMARTE) de la semaine',
						placeholder: 'Un objectif SMARTE pour cette semaine...',
						maxItems: settings.maxWeekGoals
					},
					{
						name: 'routines',
						path: 'start.routines',
						component: RoutineFieldset,
						legend: 'Mes routines de la semaine',
						placeholder: 'Une routine à suivre cette semaine...',
						maxItems: settings.maxWeekRoutines
					}
				]
			},
			end: {
				title: 'Dimanche soir',
				icon: CalendarCheck,
				fields: [
					{
						name: 'achievements',
						path: 'end.achievements',
						component: TextField,
						label: 'Mes réussites et fiertés de la semaine',
						placeholder: 'Ce dont vous êtes fier·ère cette semaine...'
					}
				]
			}
		},
		emptyState: {
			title: 'Hebdomadaire',
			start: 'Lundi matin : routines et objectifs SMARTE',
			end: 'Dimanche soir : fiertés et réussites'
		}
	};
}

export function createMonthConfig(settings: AppSettings): FormConfig {
	return {
		theme: 'theme-indigo',
		emoji: '📈',
		sections: {
			start: {
				title: '1er jour du mois',
				icon: Calendar1,
				fields: [
					{
						name: 'mantra',
						path: 'start.mantra',
						component: TextField,
						label: 'Mon mantra du mois',
						placeholder: 'Votre intention pour ce mois...'
					},
					{
						name: 'goals',
						path: 'start.goals',
						component: GoalFieldset,
						legend: 'Mes objectifs (SMARTE) du mois',
						placeholder: 'Un objectif SMARTE pour ce mois...',
						maxItems: settings.maxMonthGoals
					},
					{
						name: 'routines',
						path: 'start.routines',
						component: TextFieldset,
						legend: 'Mes (nouvelles) routines du mois',
						placeholder: 'Une nouvelle routine à intégrer ce mois...',
						maxItems: settings.maxMonthRoutines
					}
				]
			},
			end: {
				title: 'Dernier jour du mois',
				icon: CalendarCheck,
				fields: [
					{
						name: 'achievements',
						path: 'end.achievements',
						component: TextField,
						label: 'Mes réussites et fiertés du mois',
						placeholder: 'Vos accomplissements ce mois...'
					}
				]
			}
		},
		emptyState: {
			title: 'Mensuel',
			start: 'Premier jour du mois : mantra, routines, objectifs',
			end: 'Dernier jour : fiertés et réussites, évaluation'
		}
	};
}
