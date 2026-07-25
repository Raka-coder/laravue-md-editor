import { describe, it, expect } from 'vitest';
import { useMarkdownParser } from '../useMarkdownParser';

describe('useMarkdownParser', () => {
    it('parses markdown to html correctly', () => {
        const { parse } = useMarkdownParser();
        const { html, wordCount, charCount } = parse('# Hello World');
        expect(html.value).toContain('<h1>Hello World</h1>');
        expect(wordCount.value).toBe(2);
        expect(charCount.value).toBe(13);
    });

    it('sanitizes malicious script tags to prevent XSS', () => {
        const { parse } = useMarkdownParser();
        const { html } = parse('# Header <script>alert("xss")</script>');
        expect(html.value).toContain('<h1>Header </h1>');
        expect(html.value).not.toContain('<script>');
    });

    it('calculates read time correctly', () => {
        const { parse } = useMarkdownParser();
        const longText = Array(400).fill('word').join(' ');
        const { readTimeMinutes } = parse(longText);
        expect(readTimeMinutes.value).toBe(2);
    });
});
