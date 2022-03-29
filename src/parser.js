export default function parseFile(content) {
    return parseI3Config(content);
}

function parseI3Config(content) {
    const lines = content.split('\n');

    const keymap = [];
    for (let i = 0; i < lines.length;i++) {
        const match = lines[i].match(/^bindsym\s+([^\s]+(\s*\+\s*[^\s]+)*)\s+([^\n]+)$/);

        if (!match) {
            continue;
        }

        keymap.push([match[1].split('+').map(b => b.trim()), match[3]]);
    }

    return keymap;
}
