import type { EditorView } from '@codemirror/view';

type FormatType = 'bold' | 'italic' | 'code' | 'heading' | 'link' | 'quote' | 'list' | 'orderedList' | 'taskList';

const WRAPPERS: Record<string, [string, string]> = {
    bold: ['**', '**'],
    italic: ['*', '*'],
    code: ['`', '`'],
};

function wrapSelection(view: EditorView, before: string, after: string): void {
    const { from, to } = view.state.selection.main;
    const selected = view.state.sliceDoc(from, to);
    const insert = `${before}${selected}${after}`;
    const cursorPos = selected
        ? from + insert.length
        : from + before.length;
    view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: cursorPos },
    });
    view.focus();
}

function prefixLines(view: EditorView, prefix: string): void {
    const { from, to } = view.state.selection.main;
    const doc = view.state.doc;
    const lineFrom = doc.lineAt(from);
    const lineTo = doc.lineAt(to);

    const changes: { from: number; to: number; insert: string }[] = [];

    for (let l = lineFrom.number; l <= lineTo.number; l++) {
        const line = doc.line(l);
        changes.push({ from: line.from, to: line.from, insert: prefix });
    }

    view.dispatch({ changes });
    view.focus();
}

export function formatAction(view: EditorView, type: FormatType): void {
    const wrapper = WRAPPERS[type];

    if (wrapper) {
        wrapSelection(view, wrapper[0], wrapper[1]);

        return;
    }

    switch (type) {
        case 'heading':
            prefixLines(view, '## ');
            break;
        case 'quote':
            prefixLines(view, '> ');
            break;
        case 'list':
            prefixLines(view, '- ');
            break;
        case 'orderedList':
            prefixLines(view, '1. ');
            break;
        case 'taskList':
            prefixLines(view, '- [ ] ');
            break;
        case 'link': {
            const { from, to } = view.state.selection.main;
            const selected = view.state.sliceDoc(from, to);
            const text = selected || 'link text';
            view.dispatch({
                changes: { from, to, insert: `[${text}](url)` },
                selection: { anchor: from + text.length + 3, head: from + text.length + 6 },
            });
            view.focus();
            break;
        }
    }
}
