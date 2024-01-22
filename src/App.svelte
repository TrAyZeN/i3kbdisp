<script>
    import Keyboard from './Keyboard.svelte';
    import parseFile from './parser';

    let files;

    let modifierPressed = '';
    let bindingCommand = '';
    let keymap = [];

    async function handleFile(_event) {
        const content = await files[0].text();

        const tempKeymap = parseFile(content);
        keymap = [...tempKeymap];
    }

    function capitalize(str) {
        if (!str) {
            return str;
        }

        return str[0].toUpperCase() + str.slice(1);
    }

    function handleKeyboardMessage(event) {
        if (event.detail.type === 'MODIFIER_PRESSED') {
            modifierPressed = event.detail.modifierPressed.map(m => capitalize(m)).join(' ');
        } else if (event.detail.type === 'BINDING_COMMAND') {
            bindingCommand = event.detail.bindingCommand;
        } else {
            console.log('Invalid event keyboard:', event.detail);
        }
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
        <p>Command:</p>
        <p class="command">{bindingCommand}</p>
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

    .command {
        font-family: monospace;
        font-size: 16px;
    }
</style>
