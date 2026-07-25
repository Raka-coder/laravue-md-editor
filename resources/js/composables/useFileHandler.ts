export function useFileHandler() {
    const importFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file.name.endsWith('.md')) {
                reject(new Error('Only Markdown (.md) files are supported.'));

                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string || '');
            };
            reader.onerror = () => reject(new Error('Failed to read file.'));
            reader.readAsText(file);
        });
    };

    const exportFile = (content: string, filename = 'untitled.md') => {
        const sanitizedName = filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', sanitizedName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return {
        importFile,
        exportFile,
    };
}
