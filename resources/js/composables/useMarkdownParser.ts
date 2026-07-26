import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
// @ts-expect-error: types not available for markdown-it-task-lists
import taskLists from 'markdown-it-task-lists';
import { ref, computed } from 'vue';

export function useMarkdownParser() {
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: (str: string, lang: string) => {
            if (lang === 'mermaid') {
                // Return custom element to be rendered dynamically by Mermaid.js
                return `<pre class="mermaid">${str}</pre>`;
            }

            const highlighted =
                lang && hljs.getLanguage(lang)
                    ? hljs.highlight(str, { language: lang }).value
                    : null;

            const code =
                highlighted ??
                str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

            return `<pre class="hljs"><code>${code}</code></pre>`;
        },
    }).use(taskLists, { label: true });

    /**
     * Convert markdown link/image syntax to raw HTML inside HTML block tags.
     *
     * MarkdownIt with html:true still does NOT parse markdown inside block-level
     * HTML tags (<div>, <center>, etc.) per CommonMark spec.  This preprocessor
     * bridges that gap so badge patterns like:
     *
     *   <div align="center">
     *   [![PHP](...)](https://php.net)
     *   </div>
     *
     * produce actual <img> elements instead of literal text.
     */
    function preprocessHtmlBlocks(input: string): string {
        const blocks: string[] = [];
        const guarded = input.replace(
            /(```[\s\S]*?```|`[^`]*`)/g,
            (m) => (blocks.push(m), `\x00CODEBLOCK${blocks.length - 1}\x00`),
        );

        const blockTag =
            /<(div|center|section|article|aside|figure|figcaption|details|summary|header|footer|nav|main|table|thead|tbody|tfoot|tr|td|th|fieldset|form)\b[^>]*>[\s\S]*?<\/\1>/gi;

        const processed = guarded.replace(blockTag, (block) => {
            let result = block;
            result = result.replace(
                /\[!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]*)\)/g,
                '<a href="$3"><img src="$2" alt="$1" />',
            );
            result = result.replace(
                /!\[([^\]]*)\]\(([^)]*)\)/g,
                '<img src="$2" alt="$1" />',
            );
            result = result.replace(
                /\[([^\]]*)\]\(([^)]*)\)/g,
                '<a href="$2">$1</a>',
            );

            return result;
        });

        return processed.replace(
            /\x00CODEBLOCK(\d+)\x00/g,
            (_, i) => blocks[+i],
        );
    }

    const parse = (rawMarkdown: string) => {
        const preprocessed = preprocessHtmlBlocks(rawMarkdown);
        const rawHtml = md.render(preprocessed);

        // Ensure DOMPurify leaves class="mermaid", input components, and HTML attrs intact
        const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
            ADD_TAGS: ['pre', 'code', 'span', 'input'],
            ADD_ATTR: [
                'class',
                'style',
                'type',
                'checked',
                'disabled',
                'align',
            ],
        });

        const cleanText = rawMarkdown.replace(/[#*`_\[\]()\-+]/g, '').trim();
        const words = cleanText ? cleanText.split(/\s+/) : [];
        const wordCount = ref(words.length);
        const charCount = ref(rawMarkdown.length);

        // Estimate 200 words per minute reading speed
        const readTimeMinutes = computed(() =>
            Math.max(1, Math.ceil(wordCount.value / 200)),
        );

        return {
            html: ref(sanitizedHtml),
            wordCount,
            charCount,
            readTimeMinutes,
        };
    };

    return { parse };
}
export type UseMarkdownParserReturn = ReturnType<typeof useMarkdownParser>;
