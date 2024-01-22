<script>
    import { afterUpdate, createEventDispatcher } from 'svelte';

    export let keymap = [];
    export let activeColor = '#ff0000';
    export let modifierColor = '#00ffff';

    const dispatch = createEventDispatcher();

    // Maps key symbol to key id (in SVG)
    // https://github.com/i3/i3/blob/9db03797da3cea5dc6898adc79a68ba4523a409c/i3-input/keysym.map
    const layout = {
        '`': 'rect2186',
        '1': 'rect2218',
        '2': 'rect2222',
        '3': 'rect2228',
        '4': 'rect2230',
        '5': 'rect2232',
        '6': 'rect2234',
        '7': 'rect2236',
        '8': 'rect2238',
        '9': 'rect2240',
        '0': 'rect2242',
        'minus': 'rect2244',
        'equal': 'rect2246',
        'backspace': 'rect2248', // BackSpace

        'tab': 'rect2250', // Tab
        'q': 'rect2252',
        'w': 'rect2254',
        'e': 'rect2256',
        'r': 'rect2258',
        't': 'rect2262',
        'y': 'rect2264',
        'u': 'rect2266',
        'i': 'rect2270',
        'o': 'rect2272',
        'p': 'rect2274',
        'bracketleft': 'rect2278',
        'bracketright': 'rect2280',
        'backslash': 'rect2284',

        'CapsLock': 'rect2286',
        'a': 'rect2292',
        's': 'rect2296',
        'd': 'rect2298',
        'f': 'rect2300',
        'g': 'rect2302',
        'h': 'rect2306',
        'j': 'rect2308',
        'k': 'rect2312',
        'l': 'rect2314',
        'semicolon': 'rect2316',
        '\'': 'rect2318',
        'return': 'rect2320', // Return

        'shift': 'rect2322', // Shift
        'z': 'rect2324',
        'x': 'rect2326',
        'c': 'rect2330',
        'v': 'rect2334',
        'b': 'rect2336',
        'n': 'rect2338',
        'm': 'rect2340',
        'comma': 'rect2342',
        'period': 'rect2344',
        'slash': 'rect2346',
        'RightShift': 'rect2348',

        'ctrl': 'rect2350', // Ctrl
        'super': 'rect2364', // super
        'alt': 'rect2354', // alt
        'space': 'rect2362',
        'RightAlt': 'rect2360',
        'RightSuper': 'rect2366',
        'Menu': 'rect2368',
        'RightCtrl': 'rect2352',
    };

    let keyboard;
    let modifierPressed = [];
    let commands = {}; // Maps key id (in SVG) to command

    afterUpdate(() => {
        if (keyboard === null || keyboard.getSVGDocument() === null) {
            return;
        }

        highlight(keymap);
    });

    function onLoad() {
        highlight(keymap);

        for (const k in layout) {
            keyboard.getSVGDocument().getElementById(layout[k])
                .addEventListener('mouseover', (event) => {
                    let command = commands[event.srcElement.id];
                    if (!command) {
                        return;
                    }

                    dispatch('message', {
                        type: 'BINDING_COMMAND',
                        bindingCommand: command,
                    });
                });
        }

        const modifierKeys = ['shift', 'ctrl', 'alt'];
        for (let i = 0; i < modifierKeys.length; i++) {
            keyboard.getSVGDocument().getElementById(layout[modifierKeys[i]])
                .addEventListener('click', () => {
                    triggerModifierPressed(modifierKeys[i]);
                    highlight(keymap);

                    dispatch('message', {
                        type: 'MODIFIER_PRESSED',
                        modifierPressed,
                    });
                });
        }

        // Disable text selection on SVG
        // I don't know why but it doesn't work in svelte style
        for (const element of
            keyboard.getSVGDocument().getElementsByTagName('text')) {
            element.style.userSelect = 'none';
        }
    }

    // TODO: Rename this function since it also stores commands
    function highlight(keymap) {
        commands = {};
        resetKeyColors();

        for (let i = 0; i < keymap.length; i++) {
            const bindingComponents = keymap[i][0];

            if (bindingComponents.length == 1 || bindingComponents[0] != '$mod') {
                console.log('unimplemented:', bindingComponents[0]);
                continue;
            }

            if (bindingComponents.length - 2 != modifierPressed.length) {
                continue;
            }

            // WARN: Do we have to respect the order ?
            let j = 1;
            while (j < bindingComponents.length - 1
                    && isModifierPressed(bindingComponents[j])) {
                j += 1;
            }

            if (j < bindingComponents.length - 1) {
                continue;
            }
            if (!layout[bindingComponents[j]]) {
                console.log('unimplemented:', bindingComponents[j]);
                continue;
            }

            commands[layout[bindingComponents[j]]] = keymap[i][1];
            setKeyColor(bindingComponents[j], activeColor);
        }

        setKeyColor('super', modifierColor);
        for (let i = 0; i < modifierPressed.length; i++) {
            setKeyColor(modifierPressed[i], modifierColor);
        }
    }

    function resetKeyColors() {
        for (const k in layout) {
            setKeyColor(k, '#ffffff');
        }

        const greyKeys = ['tab', 'CapsLock', 'shift', 'ctrl', 'alt',
            'backspace', 'return', 'RightShift', 'RightCtrl', 'RightAlt'];
        for (let i = 0; i < greyKeys.length; i++) {
            setKeyColor(greyKeys[i], '#dfdfdf');
        }

        const lightGreyKeys = ['super', 'RightSuper', 'Menu'];
        for (let i = 0; i < lightGreyKeys.length; i++) {
            setKeyColor(lightGreyKeys[i], '#efefef');
        }
    }

    function setKeyColor(key, color) {
        let k = keyboard.getSVGDocument().getElementById(layout[key]);
        k.style.fill = color;
    }

    function triggerModifierPressed(modifier) {
        const index = modifierPressed.indexOf(modifier);

        if (index === -1) {
            modifierPressed.push(modifier);
        } else {
            modifierPressed.splice(index, 1);
        }
    }

    function isModifierPressed(modifier) {
        return modifierPressed.indexOf(modifier) !== -1;
    }
</script>

<main>
    <object
        type="image/svg+xml"
        data="assets/images/keyboard.svg"
        bind:this={keyboard}
        on:load={onLoad}
        class="keyboard"
        aria-label="keyboard"
    />
</main>

<style>
</style>
