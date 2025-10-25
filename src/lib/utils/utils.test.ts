import { describe, it, expect } from 'vitest';
import { hasContent } from './utils';

describe('hasContent', () => {
	describe('null and undefined', () => {
		it('should return false for null', () => {
			expect(hasContent(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(hasContent(undefined)).toBe(false);
		});
	});

	describe('strings', () => {
		it('should return false for empty string', () => {
			expect(hasContent('')).toBe(false);
		});

		it('should return false for whitespace-only string', () => {
			expect(hasContent('   ')).toBe(false);
		});

		it('should return false for string with only tabs', () => {
			expect(hasContent('\t\t')).toBe(false);
		});

		it('should return false for string with only newlines', () => {
			expect(hasContent('\n\n')).toBe(false);
		});

		it('should return false for mixed whitespace', () => {
			expect(hasContent('  \t\n  ')).toBe(false);
		});

		it('should return true for non-empty string', () => {
			expect(hasContent('hello')).toBe(true);
		});

		it('should return true for string with leading/trailing spaces', () => {
			expect(hasContent('  hello  ')).toBe(true);
		});

		it('should return true for single character', () => {
			expect(hasContent('a')).toBe(true);
		});

		it('should return true for number as string', () => {
			expect(hasContent('0')).toBe(true);
		});

		it('should return true for special characters', () => {
			expect(hasContent('!')).toBe(true);
		});
	});

	describe('arrays', () => {
		it('should return false for empty array', () => {
			expect(hasContent([])).toBe(false);
		});

		it('should return false for array with only null/undefined', () => {
			expect(hasContent([null, undefined])).toBe(false);
		});

		it('should return false for array with only empty strings', () => {
			expect(hasContent(['', '  ', '\t'])).toBe(false);
		});

		it('should return false for array with only empty arrays', () => {
			expect(hasContent([[], []])).toBe(false);
		});

		it('should return false for array with only empty objects', () => {
			expect(hasContent([{}, {}])).toBe(false);
		});

		it('should return true for array with one non-empty string', () => {
			expect(hasContent(['', 'hello', ''])).toBe(true);
		});

		it('should return true for array of non-empty strings', () => {
			expect(hasContent(['hello', 'world'])).toBe(true);
		});

		it('should return true for array with nested non-empty array', () => {
			expect(hasContent([[], ['item']])).toBe(true);
		});

		it('should return true for array with object containing content', () => {
			expect(hasContent([{}, { name: 'John' }])).toBe(true);
		});

		it('should return true for deeply nested array with content', () => {
			expect(hasContent([[], [[], ['deep']]])).toBe(true);
		});

		it('should return false for deeply nested empty arrays', () => {
			expect(hasContent([[], [[], []]])).toBe(false);
		});
	});

	describe('objects', () => {
		it('should return false for empty object', () => {
			expect(hasContent({})).toBe(false);
		});

		it('should return false for object with null values', () => {
			expect(hasContent({ a: null, b: undefined })).toBe(false);
		});

		it('should return false for object with empty string values', () => {
			expect(hasContent({ a: '', b: '  ' })).toBe(false);
		});

		it('should return false for object with empty array values', () => {
			expect(hasContent({ a: [], b: [] })).toBe(false);
		});

		it('should return false for object with empty nested objects', () => {
			expect(hasContent({ a: {}, b: {} })).toBe(false);
		});

		it('should return true for object with non-empty string', () => {
			expect(hasContent({ name: 'John' })).toBe(true);
		});

		it('should return true for object with non-empty array', () => {
			expect(hasContent({ items: ['item1'] })).toBe(true);
		});

		it('should return true for object with nested object containing content', () => {
			expect(hasContent({ user: { name: 'John' } })).toBe(true);
		});

		it('should return true for object with mixed empty and non-empty values', () => {
			expect(hasContent({ a: '', b: 'content', c: null })).toBe(true);
		});

		it('should return false for deeply nested empty objects', () => {
			expect(hasContent({ a: { b: { c: {} } } })).toBe(false);
		});

		it('should return true for deeply nested object with content', () => {
			expect(hasContent({ a: { b: { c: { d: 'value' } } } })).toBe(true);
		});
	});

	describe('mixed complex structures', () => {
		it('should handle array of objects with mixed content', () => {
			expect(
				hasContent([
					{ name: '', email: '' },
					{ name: '', email: '' },
					{ name: 'John', email: '' }
				] as Record<string, unknown>[])
			).toBe(true);
		});

		it('should handle object with array properties', () => {
			expect(
				hasContent({
					users: [],
					posts: ['post1'],
					comments: []
				} as Record<string, unknown>)
			).toBe(true);
		});

		it('should handle deeply nested mixed structures with content', () => {
			expect(
				hasContent({
					data: {
						users: [
							{ name: '', posts: [] },
							{ name: '', posts: [{ title: 'Post' }] }
						]
					}
				} as Record<string, unknown>)
			).toBe(true);
		});

		it('should handle deeply nested mixed structures without content', () => {
			expect(
				hasContent({
					data: {
						users: [
							{ name: '', posts: [] },
							{ name: '  ', posts: [{ title: '' }] }
						]
					}
				} as Record<string, unknown>)
			).toBe(false);
		});

		it('should handle array with mixed types', () => {
			expect(hasContent(['', null, undefined, {}, []] as unknown[])).toBe(false);
		});

		it('should handle object with various empty structures', () => {
			expect(
				hasContent({
					str: '',
					arr: [],
					obj: {},
					nested: { empty: '' },
					nullVal: null,
					undefVal: undefined
				} as Record<string, unknown>)
			).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('should handle array with single empty string', () => {
			expect(hasContent([''])).toBe(false);
		});

		it('should handle array with single whitespace string', () => {
			expect(hasContent(['   '])).toBe(false);
		});

		it('should handle object with single empty property', () => {
			expect(hasContent({ a: '' })).toBe(false);
		});

		it('should handle circular reference prevention with realistic data', () => {
			// Vitest should handle this without infinite recursion
			const obj: Record<string, unknown> = { a: 'value' };
			obj.self = obj;
			// This should find content before hitting circular reference
			expect(hasContent(obj)).toBe(true);
		});

		it('should handle very deeply nested structure with content at the end', () => {
			expect(
				hasContent({
					a: {
						b: {
							c: {
								d: {
									e: {
										f: {
											g: 'found'
										}
									}
								}
							}
						}
					}
				})
			).toBe(true);
		});

		it('should handle array of arrays of arrays with content', () => {
			expect(
				hasContent([
					[[], []],
					[[], ['item']]
				])
			).toBe(true);
		});

		it('should handle zero as string content', () => {
			expect(hasContent('0')).toBe(true);
		});

		it('should handle false as string content', () => {
			expect(hasContent('false')).toBe(true);
		});
	});

	describe('boolean and number types', () => {
		it('should return false for boolean false', () => {
			expect(hasContent(false)).toBe(false);
		});

		it('should return false for boolean true', () => {
			expect(hasContent(true)).toBe(false);
		});

		it('should return false for number 0', () => {
			expect(hasContent(0)).toBe(false);
		});

		it('should return false for number 1', () => {
			expect(hasContent(1)).toBe(false);
		});

		it('should return false for negative numbers', () => {
			expect(hasContent(-1)).toBe(false);
		});

		it('should return false for decimal numbers', () => {
			expect(hasContent(3.14)).toBe(false);
		});

		it('should return false for NaN', () => {
			expect(hasContent(NaN)).toBe(false);
		});

		it('should return false for Infinity', () => {
			expect(hasContent(Infinity)).toBe(false);
		});
	});
});
