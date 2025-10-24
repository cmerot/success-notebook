import { describe, it, expect, vi } from 'vitest';
import { getSectionStates } from './form';
import { CalendarDate } from '@internationalized/date';
import type { SectionConfig, FieldConfig } from '$lib/types/form';

// Mock component for testing
const MockComponent = {};

// Helper to create a mock SuperForm
function createMockSuperForm(): any {
	return {
		form: { subscribe: vi.fn() },
		errors: { subscribe: vi.fn() },
		constraints: { subscribe: vi.fn() },
		tainted: { subscribe: vi.fn() },
		enhance: vi.fn(),
		submit: vi.fn(),
		formId: 'test-form',
		message: { subscribe: vi.fn() },
		submitting: { subscribe: vi.fn() },
		delayed: { subscribe: vi.fn() },
		timeout: { subscribe: vi.fn() },
		posted: { subscribe: vi.fn() },
		allErrors: { subscribe: vi.fn() },
		reset: vi.fn(),
		validate: vi.fn(),
		capture: vi.fn(),
		restore: vi.fn()
	};
}

describe('deriveSectionStates', () => {
	describe('basic functionality', () => {
		it('should return empty sections for empty config', () => {
			const result = getSectionStates({
				sectionConfig: {},
				isEditMode: false,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections).toEqual([]);
			expect(result.hasContent).toBe(false);
			expect(result.isEditable).toBe(false);
		});

		it('should create section state with basic config', () => {
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [
						{
							name: 'goals',
							path: 'goals',
							component: MockComponent
						}
					]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections).toHaveLength(1);
			expect(result.sections[0].name).toBe('goals');
			expect(result.sections[0].title).toBe('Goals');
			expect(result.sections[0].fields).toHaveLength(1);
		});
	});

	describe('field content detection', () => {
		const sectionConfig: SectionConfig = {
			goals: {
				title: 'Goals',
				icon: MockComponent as any,
				fields: [
					{
						name: 'goal',
						path: 'goal',
						component: MockComponent
					}
				]
			}
		};

		it('should detect field has no content when empty string', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: '' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(false);
			expect(result.sections[0].fields[0].shouldShow).toBe(false);
			expect(result.sections[0].showContent).toBe(false);
		});

		it('should detect field has content when non-empty string', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: 'Achieve success' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(true);
			expect(result.sections[0].fields[0].shouldShow).toBe(true);
			expect(result.sections[0].showContent).toBe(true);
		});

		it('should detect field has content with non-empty array', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: ['item1', 'item2'] },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(true);
			expect(result.sections[0].showContent).toBe(true);
		});

		it('should detect field has no content with empty array', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: [] },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(false);
			expect(result.sections[0].showContent).toBe(false);
		});

		it('should handle nested field paths', () => {
			const nestedConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [
						{
							name: 'nested',
							path: 'parent.child.value',
							component: MockComponent
						}
					]
				}
			};

			const result = getSectionStates({
				sectionConfig: nestedConfig,
				isEditMode: false,
				formData: { parent: { child: { value: 'test' } } },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(true);
		});
	});

	describe('edit mode behavior', () => {
		const sectionConfig: SectionConfig = {
			goals: {
				title: 'Goals',
				icon: MockComponent as any,
				fields: [
					{
						name: 'goal',
						path: 'goal',
						component: MockComponent
					}
				]
			}
		};

		it('should show fields in edit mode even without content', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				formData: { goal: '' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].hasContent).toBe(false);
			expect(result.sections[0].fields[0].shouldShow).toBe(true);
			expect(result.sections[0].showContent).toBe(true);
		});

		it('should hide fields without content in view mode', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: '' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].shouldShow).toBe(false);
			expect(result.sections[0].showContent).toBe(false);
		});

		it('should show fields with content in view mode', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: 'Achieve success' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].shouldShow).toBe(true);
			expect(result.sections[0].showContent).toBe(true);
		});
	});

	describe('section edit mode with custom getter', () => {
		const sectionConfig: SectionConfig = {
			pastGoals: {
				title: 'Past Goals',
				icon: MockComponent as any,
				fields: [
					{
						name: 'goal',
						path: 'goal',
						component: MockComponent
					}
				]
			}
		};

		it('should use custom getSectionEditMode when provided', () => {
			const getSectionEditMode = vi.fn((isEditMode, bindToTime, date, sectionName) => {
				// Only allow editing sections from today
				return isEditMode && date.compare(new CalendarDate(2025, 1, 15)) === 0;
			});

			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				bindToTime: true,
				date: new CalendarDate(2025, 1, 10),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			expect(getSectionEditMode).toHaveBeenCalled();
			expect(result.sections[0].fields[0].isEditMode).toBe(false);
			expect(result.sections[0].isEditable).toBe(false);
		});

		it('should allow editing when custom getSectionEditMode returns true', () => {
			const getSectionEditMode = vi.fn(() => true);

			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				bindToTime: true,
				date: new CalendarDate(2025, 1, 15),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].isEditMode).toBe(true);
			expect(result.sections[0].isEditable).toBe(true);
		});

		it('should compute isEditable based on potential editability', () => {
			// This function prevents editing past dates, but section is still "editable" in general
			const getSectionEditMode = vi.fn((isEditMode, bindToTime, date) => {
				return isEditMode && date.compare(new CalendarDate(2025, 1, 15)) >= 0;
			});

			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				bindToTime: true,
				date: new CalendarDate(2025, 1, 10),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			// Section is not in edit mode currently
			expect(result.sections[0].fields[0].isEditMode).toBe(false);
			// But it would be editable if we were on a future date
			expect(result.sections[0].isEditable).toBe(false);
		});

		it('should default to global isEditMode when no custom getter', () => {
			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].isEditMode).toBe(true);
			expect(result.sections[0].isEditable).toBe(true);
		});
	});

	describe('field props building', () => {
		it('should build field props with basic config', () => {
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [
						{
							name: 'goal',
							path: 'goal',
							component: MockComponent,
							label: 'Your Goal'
						}
					]
				}
			};

			const mockForm = createMockSuperForm();
			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				formData: {},
				form: mockForm
			});

			const fieldProps = result.sections[0].fields[0].props;
			expect(fieldProps.name).toBe('goal');
			expect(fieldProps.label).toBe('Your Goal');
			expect(fieldProps.isEditMode).toBe(true);
			expect(fieldProps.form).toBe(mockForm);
		});

		it('should include optional field config properties in props', () => {
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [
						{
							name: 'goals',
							path: 'goals',
							component: MockComponent,
							label: 'Goals',
							legend: 'Enter your goals',
							maxItems: 5
						}
					]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				formData: {},
				form: createMockSuperForm()
			});

			const fieldProps = result.sections[0].fields[0].props;
			expect(fieldProps.label).toBe('Goals');
			expect(fieldProps.legend).toBe('Enter your goals');
			expect(fieldProps.maxItems).toBe(5);
		});
	});

	describe('multiple sections', () => {
		const multiSectionConfig: SectionConfig = {
			goals: {
				title: 'Goals',
				icon: MockComponent as any,
				fields: [
					{
						name: 'goal',
						path: 'goal',
						component: MockComponent
					}
				]
			},
			achievements: {
				title: 'Achievements',
				icon: MockComponent as any,
				fields: [
					{
						name: 'achievement',
						path: 'achievement',
						component: MockComponent
					}
				]
			}
		};

		it('should process multiple sections', () => {
			const result = getSectionStates({
				sectionConfig: multiSectionConfig,
				isEditMode: false,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections).toHaveLength(2);
		});

		it('should compute hasContent correctly with multiple sections', () => {
			const result = getSectionStates({
				sectionConfig: multiSectionConfig,
				isEditMode: false,
				formData: { goal: 'Test goal' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].showContent).toBe(true);
			expect(result.sections[1].showContent).toBe(false);
			expect(result.hasContent).toBe(true);
		});

		it('should compute isEditable correctly with multiple sections', () => {
			const getSectionEditMode = vi.fn((isEditMode, bindToTime, date, sectionName) => {
				return sectionName === 'goals';
			});

			const result = getSectionStates({
				sectionConfig: multiSectionConfig,
				isEditMode: true,
				date: new CalendarDate(2025, 1, 15),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections[0].isEditable).toBe(true);
			expect(result.sections[1].isEditable).toBe(false);
			expect(result.isEditable).toBe(true); // At least one section is editable
		});
	});

	describe('multiple fields per section', () => {
		const multiFieldConfig: SectionConfig = {
			goals: {
				title: 'Goals',
				icon: MockComponent as any,
				fields: [
					{
						name: 'shortTerm',
						path: 'shortTerm',
						component: MockComponent
					},
					{
						name: 'longTerm',
						path: 'longTerm',
						component: MockComponent
					},
					{
						name: 'personal',
						path: 'personal',
						component: MockComponent
					}
				]
			}
		};

		it('should process multiple fields in a section', () => {
			const result = getSectionStates({
				sectionConfig: multiFieldConfig,
				isEditMode: false,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields).toHaveLength(3);
		});

		it('should show section if any field has content', () => {
			const result = getSectionStates({
				sectionConfig: multiFieldConfig,
				isEditMode: false,
				formData: { shortTerm: '', longTerm: 'Achieve greatness', personal: '' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].shouldShow).toBe(false);
			expect(result.sections[0].fields[1].shouldShow).toBe(true);
			expect(result.sections[0].fields[2].shouldShow).toBe(false);
			expect(result.sections[0].showContent).toBe(true);
		});

		it('should show all fields in edit mode', () => {
			const result = getSectionStates({
				sectionConfig: multiFieldConfig,
				isEditMode: true,
				formData: { shortTerm: '', longTerm: '', personal: '' },
				form: createMockSuperForm()
			});

			expect(result.sections[0].fields[0].shouldShow).toBe(true);
			expect(result.sections[0].fields[1].shouldShow).toBe(true);
			expect(result.sections[0].fields[2].shouldShow).toBe(true);
			expect(result.sections[0].showContent).toBe(true);
		});
	});

	describe('aggregate values', () => {
		it('should return hasContent false when no sections have content', () => {
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [{ name: 'goal', path: 'goal', component: MockComponent }]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: '' },
				form: createMockSuperForm()
			});

			expect(result.hasContent).toBe(false);
		});

		it('should return hasContent true when at least one section has content', () => {
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [{ name: 'goal', path: 'goal', component: MockComponent }]
				},
				notes: {
					title: 'Notes',
					icon: MockComponent as any,
					fields: [{ name: 'note', path: 'note', component: MockComponent }]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: false,
				formData: { goal: '', note: 'Some note' },
				form: createMockSuperForm()
			});

			expect(result.hasContent).toBe(true);
		});

		it('should return isEditable false when no sections are editable', () => {
			const getSectionEditMode = vi.fn(() => false);
			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [{ name: 'goal', path: 'goal', component: MockComponent }]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				date: new CalendarDate(2025, 1, 15),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.isEditable).toBe(false);
		});

		it('should return isEditable true when at least one section is editable', () => {
			const getSectionEditMode = vi.fn((isEditMode, bindToTime, date, sectionName) => {
				return sectionName === 'goals';
			});

			const sectionConfig: SectionConfig = {
				goals: {
					title: 'Goals',
					icon: MockComponent as any,
					fields: [{ name: 'goal', path: 'goal', component: MockComponent }]
				},
				notes: {
					title: 'Notes',
					icon: MockComponent as any,
					fields: [{ name: 'note', path: 'note', component: MockComponent }]
				}
			};

			const result = getSectionStates({
				sectionConfig,
				isEditMode: true,
				date: new CalendarDate(2025, 1, 15),
				getSectionEditMode,
				formData: {},
				form: createMockSuperForm()
			});

			expect(result.isEditable).toBe(true);
		});
	});
});
