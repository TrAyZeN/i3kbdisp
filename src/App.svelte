<script>
    import { onMount } from 'svelte';
    import Keyboard from './Keyboard.svelte';

    let files;

    let modifierPressed = '';
    let keymap = [];

    async function parseFile(event) {
        const content = await files[0].text();
        const lines = content.split('\n');

        const tempKeymap = [];
        for (let i = 0; i < lines.length;i++) {
            const match = lines[i].match(/^bindsym\s([^\s]+)\s([^\n]+)$/);

            if (!match) {
                continue;
            }

            tempKeymap.push([match[1], match[2]]);
        }

        keymap = [...tempKeymap];
    }

    function handleMessage(event) {
        modifierPressed = event.detail.modifierPressed.join(' ');
    }
</script>

<main>
    <h1>kb-display</h1>

    <Keyboard {keymap} on:message={handleMessage} />
    <p>Modifier keys: Mod {modifierPressed}</p>

    <div>
        <p>Import your i3 config file:<p>
        <input type="file" bind:files on:change={parseFile}>
    </div>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
        max-width: none;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    input {
        max-width: 400px;
    }
</style>
