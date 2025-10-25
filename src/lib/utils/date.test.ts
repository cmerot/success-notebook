import { describe, it, expect, vi, afterEach } from 'vitest';
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

describe('getDaySectionEditMode', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let dateNowSpy: any;

	afterEach(() => {
		dateNowSpy?.mockRestore();
	});

	describe('basic edit mode behavior', () => {
		it('should return false when isEditMode is false', async () => {
			const { getDaySectionEditMode } = await import('./date');
			const result = getDaySectionEditMode(false, false, new CalendarDate(2025, 1, 15), 'start');
			expect(result).toBe(false);
		});

		it('should return true when isEditMode is true and bindToTime is false', async () => {
			const { getDaySectionEditMode } = await import('./date');
			const result = getDaySectionEditMode(true, false, new CalendarDate(2025, 1, 15), 'start');
			expect(result).toBe(true);
		});

		it('should return false for past dates when bindToTime is true', async () => {
			const { getDaySectionEditMode, today } = await import('./date');
			// Use yesterday relative to actual today
			const yesterday = today.subtract({ days: 1 });

			const result = getDaySectionEditMode(true, true, yesterday, 'start');
			expect(result).toBe(false);
		});

		it('should return false for future dates when bindToTime is true', async () => {
			const { getDaySectionEditMode, today } = await import('./date');
			// Use tomorrow relative to actual today
			const tomorrow = today.add({ days: 1 });

			const result = getDaySectionEditMode(true, true, tomorrow, 'start');
			expect(result).toBe(false);
		});
	});

	describe('time-based section editing', () => {
		it('should allow editing "start" section before noon on current day', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getDaySectionEditMode, today } = await import('./date');

			const result = getDaySectionEditMode(true, true, today, 'start');
			expect(result).toBe(true);
		});

		it('should not allow editing "start" section after noon on current day', async () => {
			// Mock current time to 2:00 PM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(14);

			const { getDaySectionEditMode, today } = await import('./date');

			const result = getDaySectionEditMode(true, true, today, 'start');
			expect(result).toBe(false);
		});

		it('should allow editing "end" section after noon on current day', async () => {
			// Mock current time to 2:00 PM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(14);

			const { getDaySectionEditMode, today } = await import('./date');

			const result = getDaySectionEditMode(true, true, today, 'end');
			expect(result).toBe(true);
		});

		it('should not allow editing "end" section before noon on current day', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getDaySectionEditMode, today } = await import('./date');

			const result = getDaySectionEditMode(true, true, today, 'end');
			expect(result).toBe(false);
		});

		it('should allow editing other sections regardless of time on current day', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getDaySectionEditMode, today } = await import('./date');

			const result = getDaySectionEditMode(true, true, today, 'notes');
			expect(result).toBe(true);
		});

		it('should handle edge case at exactly noon (12:00)', async () => {
			// Mock current time to 12:00 PM (noon)
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(12);

			const { getDaySectionEditMode, today } = await import('./date');

			// At noon (12), hour < 12 is false, so it's considered afternoon
			const startResult = getDaySectionEditMode(true, true, today, 'start');
			expect(startResult).toBe(false);

			const endResult = getDaySectionEditMode(true, true, today, 'end');
			expect(endResult).toBe(true);
		});

		it('should handle edge case at start of day (00:00)', async () => {
			// Mock current time to 00:00 AM (midnight)
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(0);

			const { getDaySectionEditMode, today } = await import('./date');

			const startResult = getDaySectionEditMode(true, true, today, 'start');
			expect(startResult).toBe(true);

			const endResult = getDaySectionEditMode(true, true, today, 'end');
			expect(endResult).toBe(false);
		});

		it('should handle edge case at end of day (23:00)', async () => {
			// Mock current time to 23:00 (11 PM)
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(23);

			const { getDaySectionEditMode, today } = await import('./date');

			const startResult = getDaySectionEditMode(true, true, today, 'start');
			expect(startResult).toBe(false);

			const endResult = getDaySectionEditMode(true, true, today, 'end');
			expect(endResult).toBe(true);
		});
	});
});

describe('getWeekSectionEditMode', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let dateNowSpy: any;

	afterEach(() => {
		dateNowSpy?.mockRestore();
	});

	describe('basic edit mode behavior', () => {
		it('should return false when isEditMode is false', async () => {
			const { getWeekSectionEditMode } = await import('./date');
			const result = getWeekSectionEditMode(
				false,
				false,
				new CalendarDate(2025, 1, 6), // Monday
				'start'
			);
			expect(result).toBe(false);
		});

		it('should return true when isEditMode is true and bindToTime is false', async () => {
			const { getWeekSectionEditMode } = await import('./date');
			const result = getWeekSectionEditMode(
				true,
				false,
				new CalendarDate(2025, 1, 6), // Monday
				'start'
			);
			expect(result).toBe(true);
		});

		it('should return false for past weeks when bindToTime is true', async () => {
			const { getWeekSectionEditMode } = await import('./date');
			const pastWeek = new CalendarDate(2024, 12, 1);

			const result = getWeekSectionEditMode(true, true, pastWeek, 'start');
			expect(result).toBe(false);
		});
	});

	describe('time-based section editing', () => {
		it('should allow editing "start" section on Monday morning', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getWeekSectionEditMode, today } = await import('./date');
			const { startOfWeek } = await import('@internationalized/date');
			const weekStart = startOfWeek(today, navigator.language);

			// Only test if today is actually Monday (start of week)
			if (weekStart.compare(today) === 0) {
				const result = getWeekSectionEditMode(true, true, today, 'start');
				expect(result).toBe(true);
			}
		});

		it('should not allow editing "start" section on Monday afternoon', async () => {
			// Mock current time to 2:00 PM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(14);

			const { getWeekSectionEditMode, today } = await import('./date');
			const { startOfWeek } = await import('@internationalized/date');
			const weekStart = startOfWeek(today, navigator.language);

			if (weekStart.compare(today) === 0) {
				const result = getWeekSectionEditMode(true, true, today, 'start');
				expect(result).toBe(false);
			}
		});

		it('should allow editing "end" section on Sunday afternoon', async () => {
			// Mock current time to 2:00 PM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(14);

			const { getWeekSectionEditMode, today } = await import('./date');
			const { endOfWeek } = await import('@internationalized/date');
			const weekEnd = endOfWeek(today, navigator.language);

			if (weekEnd.compare(today) === 0) {
				const result = getWeekSectionEditMode(true, true, today, 'end');
				expect(result).toBe(true);
			}
		});

		it('should not allow editing "end" section on Sunday morning', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getWeekSectionEditMode, today } = await import('./date');
			const { endOfWeek } = await import('@internationalized/date');
			const weekEnd = endOfWeek(today, navigator.language);

			if (weekEnd.compare(today) === 0) {
				const result = getWeekSectionEditMode(true, true, today, 'end');
				expect(result).toBe(false);
			}
		});

		it('should allow editing other sections on any day of current week', async () => {
			// Mock current time to 10:00 AM
			dateNowSpy = vi.spyOn(globalThis.Date.prototype, 'getHours').mockReturnValue(10);

			const { getWeekSectionEditMode, today } = await import('./date');

			const result = getWeekSectionEditMode(true, true, today, 'goals');
			expect(result).toBe(true);
		});

		it('should return false for middle of week days for start/end sections', async () => {
			const { getWeekSectionEditMode, today } = await import('./date');
			const { startOfWeek, endOfWeek } = await import('@internationalized/date');

			const weekStart = startOfWeek(today, navigator.language);
			const weekEnd = endOfWeek(today, navigator.language);
			const isStartOfWeek = weekStart.compare(today) === 0;
			const isEndOfWeek = weekEnd.compare(today) === 0;

			// Only test if today is middle of week (not start or end)
			if (!isStartOfWeek && !isEndOfWeek) {
				const startResult = getWeekSectionEditMode(true, true, today, 'start');
				const endResult = getWeekSectionEditMode(true, true, today, 'end');

				expect(startResult).toBe(false);
				expect(endResult).toBe(false);
			}
		});
	});
});

describe('getMonthSectionEditMode', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('basic edit mode behavior', () => {
		it('should return false when isEditMode is false', async () => {
			const { getMonthSectionEditMode } = await import('./date');
			const result = getMonthSectionEditMode(false, false, new CalendarDate(2025, 1, 1), 'start');
			expect(result).toBe(false);
		});

		it('should return true when isEditMode is true and bindToTime is false', async () => {
			const { getMonthSectionEditMode } = await import('./date');
			const result = getMonthSectionEditMode(true, false, new CalendarDate(2025, 1, 1), 'start');
			expect(result).toBe(true);
		});

		it('should return false for past months when bindToTime is true', async () => {
			const { getMonthSectionEditMode } = await import('./date');
			const pastMonth = new CalendarDate(2024, 12, 15);

			const result = getMonthSectionEditMode(true, true, pastMonth, 'start');
			expect(result).toBe(false);
		});

		it('should return false for future months when bindToTime is true', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');
			// Add 2 months to ensure it's in the future
			const futureMonth = today.add({ months: 2 });

			const result = getMonthSectionEditMode(true, true, futureMonth, 'start');
			expect(result).toBe(false);
		});
	});

	describe('time-based section editing', () => {
		it('should allow editing "start" section on first day of month', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');
			const { startOfMonth } = await import('@internationalized/date');

			const monthStart = startOfMonth(today);

			if (monthStart.compare(today) === 0) {
				const result = getMonthSectionEditMode(true, true, today, 'start');
				expect(result).toBe(true);
			}
		});

		it('should not allow editing "start" section on non-first day of month', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');
			const { startOfMonth } = await import('@internationalized/date');

			const monthStart = startOfMonth(today);

			// Only test if today is NOT the first day
			if (monthStart.compare(today) !== 0) {
				const result = getMonthSectionEditMode(true, true, today, 'start');
				expect(result).toBe(false);
			}
		});

		it('should allow editing "end" section on last day of month', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');
			const { endOfMonth } = await import('@internationalized/date');

			const monthEnd = endOfMonth(today);

			if (monthEnd.compare(today) === 0) {
				const result = getMonthSectionEditMode(true, true, today, 'end');
				expect(result).toBe(true);
			}
		});

		it('should not allow editing "end" section on non-last day of month', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');
			const { endOfMonth } = await import('@internationalized/date');

			const monthEnd = endOfMonth(today);

			// Only test if today is NOT the last day
			if (monthEnd.compare(today) !== 0) {
				const result = getMonthSectionEditMode(true, true, today, 'end');
				expect(result).toBe(false);
			}
		});

		it('should allow editing other sections on any day of current month', async () => {
			const { getMonthSectionEditMode, today } = await import('./date');

			const result = getMonthSectionEditMode(true, true, today, 'reflections');
			expect(result).toBe(true);
		});
	});
});
