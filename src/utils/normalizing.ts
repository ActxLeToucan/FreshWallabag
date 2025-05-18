import { decode } from 'he';

function normalizeTitle (title: string): string {
    title = title.replace(/[\uFF01-\uFF5E]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
    );
    title = decode(title);
    title = title.trim();
    return title;
}

export { normalizeTitle };
