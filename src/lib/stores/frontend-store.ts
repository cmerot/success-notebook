import { today } from '$lib/utils/date';
import { type CalendarDate } from '@internationalized/date';
import { writable } from 'svelte/store';

export const title = writable<CalendarDate>(today);
