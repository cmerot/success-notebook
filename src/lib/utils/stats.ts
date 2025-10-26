import type { DayFormType, WeekFormType, MonthFormType } from '$lib/schemas';
import {
	today,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	type CalendarDate
} from '@internationalized/date';

export interface DayStatsPoint {
	date: Date;
	dateStr: string;
	mood: number;
	tasksScore: number;
	tasksCompleted: number;
	tasksTotal: number;
}

export interface StreakStats {
	currentStreak: number;
	longestStreak: number;
}

export interface MoodStats {
	average: number;
	startAverage: number;
	endAverage: number;
	trend: 'improving' | 'declining' | 'stable';
	dataPoints: Array<{
		date: Date;
		dateStr: string;
		startMood: number | null;
		endMood: number | null;
		average: number;
	}>;
	// Séries pour affichage graphique (avec null pour les jours manquants)
	averageSeries: Array<{ date: Date; dateStr: string; value: number | null }>;
	startSeries: Array<{ date: Date; dateStr: string; value: number | null }>;
	endSeries: Array<{ date: Date; dateStr: string; value: number | null }>;
	// Série combinée avec 2 points par jour (start à 8h, end à 20h)
	combinedSeries: Array<{
		date: Date;
		dateStr: string;
		value: number | null;
		type: 'start' | 'end';
	}>;
}

export interface ProductivityStats {
	taskCompletionRate: number;
	todoCompletionRate: number;
	relaxCompletionRate: number;
	totalPlanned: number;
	totalCompleted: number;
	byDayOfWeek: Array<{
		dayName: string;
		completionRate: number;
		planned: number;
		completed: number;
	}>;
	dataPoints: Array<{
		date: Date;
		dateStr: string;
		todoPlanned: number;
		todoCompleted: number;
		relaxPlanned: number;
		relaxCompleted: number;
		totalPlanned: number;
		totalCompleted: number;
	}>;
}

export interface RoutineStats {
	adherenceRate: number; // Overall percentage
	routines: Array<{
		name: string;
		plannedDays: number;
		completedDays: number;
		adherenceRate: number;
	}>;
	byDayOfWeek: Array<{
		dayName: string;
		plannedCount: number;
		adherenceRate: number;
	}>;
}

export interface GoalStats {
	averageCompletion: number;
	completedGoals: number;
	totalGoals: number;
	weeklyGoals: Array<{
		date: string;
		goals: Array<{ text: string; completion: number }>;
		averageCompletion: number;
	}>;
	monthlyGoals: Array<{
		date: string;
		goals: Array<{ text: string; completion: number }>;
		averageCompletion: number;
	}>;
}

export interface AllStats {
	mood: MoodStats;
	productivity: ProductivityStats;
	routines: RoutineStats;
	goals: GoalStats;
	streaks: StreakStats;
}

// Helper to check if two dates are consecutive days
function isConsecutiveDay(date1: CalendarDate, date2: CalendarDate): boolean {
	const nextDay = date1.add({ days: 1 });
	return nextDay.compare(date2) === 0;
}

/**
 * Calculate streaks from day entries
 */
export function calculateStreaks(dayDates: CalendarDate[]): StreakStats {
	if (dayDates.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	const todayDate = today('UTC');
	const yesterdayDate = todayDate.subtract({ days: 1 });

	// Filter out future dates (only consider dates up to today)
	const validDates = dayDates.filter((date) => date.compare(todayDate) <= 0);

	if (validDates.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	// Sort dates in ascending order
	const sortedDates = [...validDates].sort((a, b) => a.compare(b));

	let longestStreak = 1;
	let currentStreakLength = 1;
	let currentStreak = 0;

	// Calculate all streaks
	for (let i = 1; i < sortedDates.length; i++) {
		if (isConsecutiveDay(sortedDates[i - 1], sortedDates[i])) {
			currentStreakLength++;
		} else {
			longestStreak = Math.max(longestStreak, currentStreakLength);
			currentStreakLength = 1;
		}
	}
	longestStreak = Math.max(longestStreak, currentStreakLength);

	// Calculate current streak (must include today or yesterday)
	const lastDate = sortedDates[sortedDates.length - 1];

	if (lastDate.compare(todayDate) === 0 || lastDate.compare(yesterdayDate) === 0) {
		// Current streak is active
		currentStreak = 1;
		for (let i = sortedDates.length - 2; i >= 0; i--) {
			if (isConsecutiveDay(sortedDates[i], sortedDates[i + 1])) {
				currentStreak++;
			} else {
				break;
			}
		}
	}

	return { currentStreak, longestStreak };
}

/**
 * Prepare statistics data for the last N days
 */
export function prepareStatsData(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	days: number = 7
): DayStatsPoint[] {
	const currentDate = today('UTC');
	const statsData: DayStatsPoint[] = [];

	for (let i = days - 1; i >= 0; i--) {
		const date = currentDate.subtract({ days: i });

		// Find day entry
		const dayEntry = allEntries.find((e) => e.type === 'day' && e.date.compare(date) === 0);

		let mood = 0;
		let tasksScore = 0;
		let planned = 0;
		let completed = 0;

		if (dayEntry) {
			const day = dayEntry.entry as DayFormType;

			// Calculate average mood for the day
			const moodLevels: number[] = [];
			if (day.start?.mood?.level) {
				moodLevels.push(day.start.mood.level);
			}
			if (day.end?.mood?.level) {
				moodLevels.push(day.end.mood.level);
			}
			if (moodLevels.length > 0) {
				mood = moodLevels.reduce((sum, level) => sum + level, 0) / moodLevels.length;
			}

			// Count todo tasks (includes routines added to the day)
			if (day.start?.todoList) {
				planned += day.start.todoList.length;
				completed += day.start.todoList.filter((t) => t.completed).length;
			}

			// Count toRelax tasks (includes routines added to the day)
			if (day.start?.toRelaxList) {
				planned += day.start.toRelaxList.length;
				completed += day.start.toRelaxList.filter((t) => t.completed).length;
			}

			// Convert to a score out of 5
			if (planned > 0) {
				tasksScore = (completed / planned) * 5;
			}
		}

		statsData.push({
			date: date.toDate('UTC'),
			dateStr: date.toString(),
			mood: Math.round(mood * 10) / 10, // Round to 1 decimal
			tasksScore: Math.round(tasksScore * 10) / 10, // Round to 1 decimal
			tasksCompleted: completed,
			tasksTotal: planned
		});
	}

	return statsData;
}

/**
 * Calculate mood statistics for a given period
 */
export function calculateMoodStats(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	startDate: CalendarDate,
	endDate: CalendarDate
): MoodStats {
	// Créer une map des entrées par date pour un accès rapide
	const entriesByDate = new Map(
		allEntries.filter((e) => e.type === 'day').map((e) => [e.date.toString(), e])
	);

	const dataPoints: MoodStats['dataPoints'] = [];
	let totalStart = 0;
	let totalEnd = 0;
	let totalAvg = 0;
	let startCount = 0;
	let endCount = 0;
	let avgCount = 0;

	// Itérer sur tous les jours de la période
	let currentDate = startDate;
	while (currentDate.compare(endDate) <= 0) {
		const entry = entriesByDate.get(currentDate.toString());

		let startMood: number | null = null;
		let endMood: number | null = null;
		let average = 0;
		let count = 0;

		if (entry) {
			const day = entry.entry as DayFormType;
			startMood = day.start?.mood?.level ?? null;
			endMood = day.end?.mood?.level ?? null;

			if (startMood) {
				totalStart += startMood;
				startCount++;
				average += startMood;
				count++;
			}
			if (endMood) {
				totalEnd += endMood;
				endCount++;
				average += endMood;
				count++;
			}
			if (count > 0) {
				average = average / count;
				totalAvg += average;
				avgCount++;
			}
		}

		dataPoints.push({
			date: currentDate.toDate('UTC'),
			dateStr: currentDate.toString(),
			startMood,
			endMood,
			average: count > 0 ? Math.round(average * 10) / 10 : 0
		});

		currentDate = currentDate.add({ days: 1 });
	}

	const overallAverage = avgCount > 0 ? totalAvg / avgCount : 0;
	const startAverage = startCount > 0 ? totalStart / startCount : 0;
	const endAverage = endCount > 0 ? totalEnd / endCount : 0;

	// Calculate trend (simple linear regression on averages)
	let trend: 'improving' | 'declining' | 'stable' = 'stable';
	if (dataPoints.length >= 2) {
		const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
		const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));

		const firstAvg = firstHalf.reduce((sum, p) => sum + p.average, 0) / firstHalf.length;
		const secondAvg = secondHalf.reduce((sum, p) => sum + p.average, 0) / secondHalf.length;

		const diff = secondAvg - firstAvg;
		if (diff > 0.3) trend = 'improving';
		else if (diff < -0.3) trend = 'declining';
	}

	// Construire les séries pour affichage graphique
	// Inclure tous les jours avec null pour créer des gaps visuels
	const averageSeries = dataPoints.map((p) => ({
		date: p.date,
		dateStr: p.dateStr,
		value: p.average > 0 ? p.average : null
	}));

	const startSeries = dataPoints.map((p) => ({
		date: p.date,
		dateStr: p.dateStr,
		value: p.startMood
	}));

	const endSeries = dataPoints.map((p) => ({
		date: p.date,
		dateStr: p.dateStr,
		value: p.endMood
	}));

	// Construire la série combinée avec 2 points par jour (start à 8h, end à 20h)
	const combinedSeries: MoodStats['combinedSeries'] = [];
	for (const point of dataPoints) {
		// Point du matin (8h)
		if (point.startMood !== null) {
			const startDate = new Date(point.date);
			startDate.setHours(8, 0, 0, 0);
			combinedSeries.push({
				date: startDate,
				dateStr: point.dateStr,
				value: point.startMood,
				type: 'start'
			});
		}

		// Point du soir (20h)
		if (point.endMood !== null) {
			const endDate = new Date(point.date);
			endDate.setHours(20, 0, 0, 0);
			combinedSeries.push({
				date: endDate,
				dateStr: point.dateStr,
				value: point.endMood,
				type: 'end'
			});
		}
	}

	return {
		average: Math.round(overallAverage * 10) / 10,
		startAverage: Math.round(startAverage * 10) / 10,
		endAverage: Math.round(endAverage * 10) / 10,
		trend,
		dataPoints,
		averageSeries,
		startSeries,
		endSeries,
		combinedSeries
	};
}

/**
 * Calculate productivity statistics for a given period
 */
export function calculateProductivityStats(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	startDate: CalendarDate,
	endDate: CalendarDate
): ProductivityStats {
	const dayEntries = allEntries.filter(
		(e) => e.type === 'day' && e.date.compare(startDate) >= 0 && e.date.compare(endDate) <= 0
	);

	let totalPlanned = 0;
	let totalCompleted = 0;
	let todoPlanned = 0;
	let todoCompleted = 0;
	let relaxPlanned = 0;
	let relaxCompleted = 0;

	const byDayOfWeek = new Map<number, { planned: number; completed: number }>();
	const dataPoints: ProductivityStats['dataPoints'] = [];

	for (const entry of dayEntries) {
		const day = entry.entry as DayFormType;
		const dayOfWeek = entry.date.toDate('UTC').getDay();

		let dayTodoPlanned = 0;
		let dayTodoCompleted = 0;
		let dayRelaxPlanned = 0;
		let dayRelaxCompleted = 0;

		if (day.start?.todoList) {
			dayTodoPlanned = day.start.todoList.length;
			dayTodoCompleted = day.start.todoList.filter((t) => t.completed).length;
			todoPlanned += dayTodoPlanned;
			todoCompleted += dayTodoCompleted;
		}

		if (day.start?.toRelaxList) {
			dayRelaxPlanned = day.start.toRelaxList.length;
			dayRelaxCompleted = day.start.toRelaxList.filter((t) => t.completed).length;
			relaxPlanned += dayRelaxPlanned;
			relaxCompleted += dayRelaxCompleted;
		}

		const dayTotal = dayTodoPlanned + dayRelaxPlanned;
		const dayCompleted = dayTodoCompleted + dayRelaxCompleted;

		totalPlanned += dayTotal;
		totalCompleted += dayCompleted;

		// Track by day of week
		const existing = byDayOfWeek.get(dayOfWeek) || { planned: 0, completed: 0 };
		byDayOfWeek.set(dayOfWeek, {
			planned: existing.planned + dayTotal,
			completed: existing.completed + dayCompleted
		});

		dataPoints.push({
			date: entry.date.toDate('UTC'),
			dateStr: entry.date.toString(),
			todoPlanned: dayTodoPlanned,
			todoCompleted: dayTodoCompleted,
			relaxPlanned: dayRelaxPlanned,
			relaxCompleted: dayRelaxCompleted,
			totalPlanned: dayTotal,
			totalCompleted: dayCompleted
		});
	}

	const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
	const byDayOfWeekArray = Array.from(byDayOfWeek.entries())
		.map(([day, stats]) => ({
			dayName: dayNames[day],
			completionRate: stats.planned > 0 ? Math.round((stats.completed / stats.planned) * 100) : 0,
			planned: stats.planned,
			completed: stats.completed
		}))
		.sort((a, b) => {
			const aIdx = dayNames.indexOf(a.dayName);
			const bIdx = dayNames.indexOf(b.dayName);
			return aIdx - bIdx;
		});

	return {
		taskCompletionRate: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
		todoCompletionRate: todoPlanned > 0 ? Math.round((todoCompleted / todoPlanned) * 100) : 0,
		relaxCompletionRate: relaxPlanned > 0 ? Math.round((relaxCompleted / relaxPlanned) * 100) : 0,
		totalPlanned,
		totalCompleted,
		byDayOfWeek: byDayOfWeekArray,
		dataPoints
	};
}

/**
 * Calculate routine adherence statistics
 * Reads the boolean values from week.start.routines which track completion
 * (initially set as planned, then updated during the week as tasks are completed)
 */
export function calculateRoutineStats(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	startDate: CalendarDate,
	endDate: CalendarDate
): RoutineStats {
	// Get all week entries in the period
	const weekEntries = allEntries.filter(
		(e) => e.type === 'week' && e.date.compare(startDate) >= 0 && e.date.compare(endDate) <= 0
	);

	const routineMap = new Map<string, { completedDays: number; totalDays: number }>();
	const dayOfWeekStats = new Map<number, { completed: number; total: number }>();

	// Process each week entry
	for (const weekEntry of weekEntries) {
		const week = weekEntry.entry as WeekFormType;
		if (!week.start?.routines) continue;

		// For each routine in this week
		for (const routine of week.start.routines) {
			// Map day booleans to day numbers (0=Sunday, 1=Monday, etc.)
			const daysOfWeek = [
				{ day: 1, completed: routine.monday },
				{ day: 2, completed: routine.tuesday },
				{ day: 3, completed: routine.wednesday },
				{ day: 4, completed: routine.thursday },
				{ day: 5, completed: routine.friday },
				{ day: 6, completed: routine.saturday },
				{ day: 0, completed: routine.sunday }
			];

			for (const { day, completed } of daysOfWeek) {
				// Calculate the actual date for this day of the week
				const weekStartDate = weekEntry.date; // This is the Monday of the week
				const dayDate = weekStartDate.add({ days: day === 0 ? 6 : day - 1 });

				// Check if this day is within our period
				if (dayDate.compare(startDate) < 0 || dayDate.compare(endDate) > 0) continue;

				// Track this routine
				const routineData = routineMap.get(routine.text) || { completedDays: 0, totalDays: 0 };
				routineData.totalDays++;
				if (completed) {
					routineData.completedDays++;
				}
				routineMap.set(routine.text, routineData);

				// Track by day of week
				const dowData = dayOfWeekStats.get(day) || { completed: 0, total: 0 };
				dowData.total++;
				if (completed) {
					dowData.completed++;
				}
				dayOfWeekStats.set(day, dowData);
			}
		}
	}

	// Convert to arrays
	const routines = Array.from(routineMap.entries()).map(([name, data]) => ({
		name,
		plannedDays: data.totalDays,
		completedDays: data.completedDays,
		adherenceRate: data.totalDays > 0 ? Math.round((data.completedDays / data.totalDays) * 100) : 0
	}));

	const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
	const byDayOfWeek = dayNames.map((dayName, idx) => {
		const stats = dayOfWeekStats.get(idx) || { completed: 0, total: 0 };
		return {
			dayName,
			plannedCount: stats.total,
			adherenceRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
		};
	});

	const totalCompleted = routines.reduce((sum, r) => sum + r.completedDays, 0);
	const totalDays = routines.reduce((sum, r) => sum + r.plannedDays, 0);
	const adherenceRate = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;

	return {
		adherenceRate,
		routines,
		byDayOfWeek
	};
}

/**
 * Calculate goal statistics for a given period
 */
export function calculateGoalStats(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	startDate: CalendarDate,
	endDate: CalendarDate
): GoalStats {
	const weekEntries = allEntries.filter(
		(e) => e.type === 'week' && e.date.compare(startDate) >= 0 && e.date.compare(endDate) <= 0
	);

	const monthEntries = allEntries.filter(
		(e) => e.type === 'month' && e.date.compare(startDate) >= 0 && e.date.compare(endDate) <= 0
	);

	let totalGoals = 0;
	let completedGoals = 0;
	let totalCompletion = 0;

	const weeklyGoals: GoalStats['weeklyGoals'] = weekEntries.map((entry) => {
		const week = entry.entry as WeekFormType;
		const goals = week.start?.goals || [];
		totalGoals += goals.length;
		completedGoals += goals.filter((g) => g.completion === 100).length;

		const avgCompletion =
			goals.length > 0
				? Math.round(goals.reduce((sum, g) => sum + g.completion, 0) / goals.length)
				: 0;
		totalCompletion += avgCompletion * goals.length;

		return {
			date: entry.date.toString(),
			goals: goals.map((g) => ({ text: g.text, completion: g.completion })),
			averageCompletion: avgCompletion
		};
	});

	const monthlyGoals: GoalStats['monthlyGoals'] = monthEntries.map((entry) => {
		const month = entry.entry as MonthFormType;
		const goals = month.start?.goals || [];
		totalGoals += goals.length;
		completedGoals += goals.filter((g) => g.completion === 100).length;

		const avgCompletion =
			goals.length > 0
				? Math.round(goals.reduce((sum, g) => sum + g.completion, 0) / goals.length)
				: 0;
		totalCompletion += avgCompletion * goals.length;

		return {
			date: entry.date.toString(),
			goals: goals.map((g) => ({ text: g.text, completion: g.completion })),
			averageCompletion: avgCompletion
		};
	});

	return {
		averageCompletion: totalGoals > 0 ? Math.round(totalCompletion / totalGoals) : 0,
		completedGoals,
		totalGoals,
		weeklyGoals,
		monthlyGoals
	};
}

/**
 * Calculate all statistics for a given period
 */
export function calculateAllStats(
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[],
	startDate: CalendarDate,
	endDate: CalendarDate
): AllStats {
	// Streaks are always calculated on ALL entries (not filtered by period)
	// because current streak is a global metric
	const allDayDates = allEntries.filter((e) => e.type === 'day').map((e) => e.date);

	return {
		mood: calculateMoodStats(allEntries, startDate, endDate),
		productivity: calculateProductivityStats(allEntries, startDate, endDate),
		routines: calculateRoutineStats(allEntries, startDate, endDate),
		goals: calculateGoalStats(allEntries, startDate, endDate),
		streaks: calculateStreaks(allDayDates)
	};
}

/**
 * Navigation types and utilities
 */
export type PeriodType = 'week' | 'month' | 'all';

export interface PeriodInfo {
	startDate: CalendarDate;
	endDate: CalendarDate;
	periodLabel: string;
	canNavigateNext: boolean;
}

/**
 * Calculate period information based on period type and offset
 */
export function calculatePeriodInfo(
	periodType: PeriodType,
	offset: number,
	allEntries: {
		date: CalendarDate;
		type: 'day' | 'week' | 'month';
		entry: DayFormType | WeekFormType | MonthFormType;
	}[]
): PeriodInfo {
	const todayDate = today('UTC');
	let startDate = todayDate;
	let endDate = todayDate;
	let periodLabel = '';
	let canNavigateNext = false;

	if (periodType === 'all') {
		// Find the earliest entry
		if (allEntries.length > 0) {
			const sortedEntries = [...allEntries].sort((a, b) => a.date.compare(b.date));
			startDate = sortedEntries[0].date;
		}
		endDate = todayDate;
		periodLabel = 'Toutes les données';
		canNavigateNext = false;
	} else if (periodType === 'week') {
		// Calculate week boundaries (Monday to Sunday)
		const targetDate = todayDate.subtract({ weeks: offset });
		startDate = startOfWeek(targetDate, 'fr-FR'); // Monday
		endDate = endOfWeek(targetDate, 'fr-FR'); // Sunday

		// Format: "Semaine du 18 au 24 mars 2025"
		const startDay = startDate.day;
		const endDay = endDate.day;
		const startMonth = startDate.toDate('UTC').toLocaleDateString('fr-FR', { month: 'long' });
		const endMonth = endDate.toDate('UTC').toLocaleDateString('fr-FR', { month: 'long' });
		const year = endDate.year;

		if (startDate.month === endDate.month) {
			periodLabel = `Semaine du ${startDay} au ${endDay} ${startMonth} ${year}`;
		} else {
			periodLabel = `Semaine du ${startDay} ${startMonth} au ${endDay} ${endMonth} ${year}`;
		}

		// Check if we can navigate to next period
		const nextWeekStart = startOfWeek(todayDate.subtract({ weeks: offset - 1 }), 'fr-FR');
		canNavigateNext = offset > 0 && nextWeekStart.compare(todayDate) <= 0;
	} else if (periodType === 'month') {
		// Calculate month boundaries
		const targetDate = todayDate.subtract({ months: offset });
		startDate = startOfMonth(targetDate);
		endDate = endOfMonth(targetDate);

		// Format: "Mars 2025"
		periodLabel = endDate.toDate('UTC').toLocaleDateString('fr-FR', {
			month: 'long',
			year: 'numeric'
		});
		periodLabel = periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1);

		// Check if we can navigate to next period
		const nextMonthStart = startOfMonth(todayDate.subtract({ months: offset - 1 }));
		canNavigateNext = offset > 0 && nextMonthStart.compare(todayDate) <= 0;
	}

	return {
		startDate,
		endDate,
		periodLabel,
		canNavigateNext
	};
}
