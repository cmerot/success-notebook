import { getLocalTimeZone, type CalendarDate, today } from '@internationalized/date';
import { writable } from 'svelte/store';

export const title = writable<CalendarDate>(today(getLocalTimeZone()));
