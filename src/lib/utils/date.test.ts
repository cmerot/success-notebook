import { describe, it, expect } from 'vitest';
import { buildHierarchicalEntries } from './date';
import { CalendarDate } from '@internationalized/date';

describe('buildHierarchicalEntries', () => {
	it('should return empty array for empty input', () => {
		const result = buildHierarchicalEntries([]);
		expect(result).toEqual([]);
	});

	it('should create a single day entry', () => {
		const entries = [{ date: new CalendarDate(2025, 1, 15), type: 'day' as const }];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].date).toEqual(new CalendarDate(2025, 1, 1)); // Month start
		expect(result[0].hasEntry).toBe(false); // No month entry
		expect(result[0].weeks).toHaveLength(1);
		expect(result[0].weeks[0].hasEntry).toBe(false); // No week entry
		expect(result[0].weeks[0].days).toHaveLength(1);
		expect(result[0].weeks[0].days[0].date).toEqual(new CalendarDate(2025, 1, 15));
	});

	it('should mark month as hasEntry when month entry exists', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 1), type: 'month' as const },
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].hasEntry).toBe(true); // Month entry exists
	});

	it('should mark week as hasEntry when week entry exists', () => {
		// Use Monday (start of week in most locales)
		const entries = [
			{ date: new CalendarDate(2025, 1, 6), type: 'week' as const }, // Monday
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].weeks).toHaveLength(1);
		expect(result[0].weeks[0].hasEntry).toBe(true); // Week entry exists
	});

	it('should group multiple days in the same week', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 7), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 8), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1); // One month
		expect(result[0].weeks).toHaveLength(1); // One week
		expect(result[0].weeks[0].days).toHaveLength(3); // Three days
	});

	it('should separate days from different weeks', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const }, // Week 1
			{ date: new CalendarDate(2025, 1, 13), type: 'day' as const } // Week 2
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1); // One month
		expect(result[0].weeks).toHaveLength(2); // Two weeks
		expect(result[0].weeks[0].days).toHaveLength(1);
		expect(result[0].weeks[1].days).toHaveLength(1);
	});

	it('should separate entries from different months', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const },
			{ date: new CalendarDate(2025, 2, 15), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(2); // Two months
		expect(result[0].date.month).toBe(2); // Feb (most recent first)
		expect(result[1].date.month).toBe(1); // Jan
	});

	it('should sort months in descending order', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const },
			{ date: new CalendarDate(2025, 3, 15), type: 'day' as const },
			{ date: new CalendarDate(2025, 2, 15), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(3);
		expect(result[0].date.month).toBe(3); // March first
		expect(result[1].date.month).toBe(2); // February
		expect(result[2].date.month).toBe(1); // January last
	});

	it('should sort weeks in descending order within a month', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const }, // Week 1
			{ date: new CalendarDate(2025, 1, 20), type: 'day' as const }, // Week 3
			{ date: new CalendarDate(2025, 1, 13), type: 'day' as const } // Week 2
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].weeks).toHaveLength(3);
		// Most recent week first
		expect(result[0].weeks[0].date.day).toBeGreaterThan(result[0].weeks[1].date.day);
		expect(result[0].weeks[1].date.day).toBeGreaterThan(result[0].weeks[2].date.day);
	});

	it('should sort days in descending order within a week', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 8), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 7), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].weeks).toHaveLength(1);
		expect(result[0].weeks[0].days).toHaveLength(3);
		// Most recent day first
		expect(result[0].weeks[0].days[0].date.day).toBe(8);
		expect(result[0].weeks[0].days[1].date.day).toBe(7);
		expect(result[0].weeks[0].days[2].date.day).toBe(6);
	});

	it('should handle mixed entry types (day, week, month)', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 1), type: 'month' as const },
			{ date: new CalendarDate(2025, 1, 5), type: 'week' as const },
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 12), type: 'week' as const },
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].hasEntry).toBe(true); // Month entry exists
		expect(result[0].weeks.length).toBeGreaterThan(0);

		// Check that some weeks have entries
		const weeksWithEntries = result[0].weeks.filter((w) => w.hasEntry);
		expect(weeksWithEntries.length).toBeGreaterThan(0);

		// Check that days are present
		const totalDays = result[0].weeks.reduce((sum, week) => sum + week.days.length, 0);
		expect(totalDays).toBe(2);
	});

	it('should handle entries spanning multiple years', () => {
		const entries = [
			{ date: new CalendarDate(2024, 12, 15), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(2); // Two months
		expect(result[0].date.year).toBe(2025); // Most recent year first
		expect(result[1].date.year).toBe(2024);
	});

	it('should only include day entries in days array', () => {
		const entries = [
			{ date: new CalendarDate(2025, 1, 1), type: 'month' as const },
			{ date: new CalendarDate(2025, 1, 5), type: 'week' as const },
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 7), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);

		// Count total days across all weeks
		const totalDays = result[0].weeks.reduce((sum, week) => sum + week.days.length, 0);
		expect(totalDays).toBe(2); // Only 2 day entries
	});

	it('should create month container even with only week entries', () => {
		const entries = [{ date: new CalendarDate(2025, 1, 5), type: 'week' as const }];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].date).toEqual(new CalendarDate(2025, 1, 1)); // Month start
		expect(result[0].hasEntry).toBe(false); // No month entry
		expect(result[0].weeks).toHaveLength(1);
		expect(result[0].weeks[0].hasEntry).toBe(true); // Week entry exists
		expect(result[0].weeks[0].days).toHaveLength(0); // No day entries
	});

	it('should not create week container for month-only entries', () => {
		const entries = [{ date: new CalendarDate(2025, 1, 15), type: 'month' as const }];
		const result = buildHierarchicalEntries(entries);

		expect(result).toHaveLength(1);
		expect(result[0].hasEntry).toBe(true); // Month entry exists
		// Month entry should NOT create a week container
		expect(result[0].weeks.length).toBe(0);
	});

	it('should preserve date objects correctly', () => {
		const testDate = new CalendarDate(2025, 6, 15);
		const entries = [{ date: testDate, type: 'day' as const }];
		const result = buildHierarchicalEntries(entries);

		expect(result[0].weeks[0].days[0].date).toEqual(testDate);
		expect(result[0].weeks[0].days[0].type).toBe('day');
	});

	it('should handle complex real-world scenario', () => {
		const entries = [
			// January entries
			{ date: new CalendarDate(2025, 1, 1), type: 'month' as const },
			{ date: new CalendarDate(2025, 1, 6), type: 'week' as const },
			{ date: new CalendarDate(2025, 1, 6), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 7), type: 'day' as const },
			{ date: new CalendarDate(2025, 1, 13), type: 'week' as const },
			{ date: new CalendarDate(2025, 1, 15), type: 'day' as const },
			// February entries
			{ date: new CalendarDate(2025, 2, 1), type: 'month' as const },
			{ date: new CalendarDate(2025, 2, 3), type: 'week' as const },
			{ date: new CalendarDate(2025, 2, 5), type: 'day' as const }
		];
		const result = buildHierarchicalEntries(entries);

		// Two months
		expect(result).toHaveLength(2);

		// February first (most recent)
		expect(result[0].date.month).toBe(2);
		expect(result[0].hasEntry).toBe(true);

		// January second
		expect(result[1].date.month).toBe(1);
		expect(result[1].hasEntry).toBe(true);

		// Check January structure
		expect(result[1].weeks.length).toBeGreaterThan(0);
		const janDaysCount = result[1].weeks.reduce((sum, week) => sum + week.days.length, 0);
		expect(janDaysCount).toBe(3); // 3 day entries in January
	});
});
