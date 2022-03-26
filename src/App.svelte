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
    <div class="header">
        <h1>i3kbdisp</h1>
        <p>Visualize your i3 key bindings</p>
    </div>

    <div>
        <Keyboard {keymap} on:message={handleMessage} />
        <p>Modifier keys: Mod {modifierPressed}</p>
    </div>

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

    .header {
        margin-bottom: 2em;
    }
</style>
