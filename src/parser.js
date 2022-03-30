export default function parseFile(content) {
    return parseI3Config(content);
}

function parseI3Config(content) {
    const lines = content.split('\n');

    const keymap = [];
    for (let i = 0; i < lines.length;i++) {
        const match = lines[i].match(/^bindsym\s+(--release\s+)?([^\s]+(\s*\+\s*[^\s]+)*)\s+([^\n]+)$/);

        if (!match) {
            continue;
        }

        keymap.push([match[2].split('+').map(b => b.trim()), match[4]]);
    }

    return keymap;
}
