function generateGameContainer() {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'GameContainer';

    for (let i = 1; i <= 6; i++) {
        let rowContainer = document.createElement('div');
        rowContainer.className = 'RowContainer';
        rowContainer.setAttribute('aria-label', `row ${i}`);

        for (let j = 1; j <= 5; j++) {
            let tileContainer = document.createElement('div');
            tileContainer.className = 'TileContainer';
            tileContainer.setAttribute('aria-label', `tile ${j}`);

            let input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.setAttribute('aria-label', `letter ${j}`);
            input.autocomplete = 'off';

            tileContainer.appendChild(input);
            rowContainer.appendChild(tileContainer);
        }

        gameContainer.appendChild(rowContainer);
    }

    return gameContainer;
}

function generateKeyboard() {
    const keyboardLayout = [
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Backspace']
    ];

    const keyboardContainer = document.createElement('div');
    keyboardContainer.className = 'KeyboardContainer';

    keyboardLayout.forEach((row, rowIndex) => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'KeyboardRow';
        keyboardRow.setAttribute('aria-label', `row ${rowIndex + 1}`);

        row.forEach((letter, index) => {
            const keyboardTile = document.createElement('div');
            keyboardTile.className = 'KeyboardTile';
            keyboardTile.setAttribute('aria-label', `tile ${index + 1}`);

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'key'; // Add a class to the button
            button.setAttribute('data-key', letter.toLowerCase()); // Add a data-key attribute to the button
            button.setAttribute('aria-label', `letter ${index + 1}`);
            button.onclick = () => window.handleClick(button);
            button.textContent = letter;

            keyboardTile.appendChild(button);
            keyboardRow.appendChild(keyboardTile);
        });

        keyboardContainer.appendChild(keyboardRow);
    });

    return keyboardContainer;
}

// Generate the game container and append it to the body
const gameContainer = generateGameContainer();
document.body.appendChild(gameContainer);

// Generate the keyboard and append it to the game container
const keyboardContainer = generateKeyboard();
gameContainer.appendChild(keyboardContainer);