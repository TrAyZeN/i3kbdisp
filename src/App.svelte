<script>
    import Keyboard from './Keyboard.svelte';
    import parseFile from './parser';

    let files;

    let modifierPressed = '';
    let keymap = [];

    async function handleFile(_event) {
        const content = await files[0].text();

        const tempKeymap = parseFile(content);
        keymap = [...tempKeymap];
    }

    function handleKeyboardMessage(event) {
        modifierPressed = event.detail.modifierPressed.join(' ');
    }
</script>

<main>
    <div class="header">
        <h1>i3kbdisp</h1>
        <p>Visualize your i3 key bindings</p>
    </div>

    <div>
        <Keyboard {keymap} on:message={handleKeyboardMessage} />
        <p>Modifier keys: Mod {modifierPressed}</p>
    </div>

    <div>
        <p>Import your i3 config file:<p>
        <input type="file" bind:files on:change={handleFile}>
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
