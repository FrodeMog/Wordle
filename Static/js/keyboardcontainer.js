const keyboardLayout = [
    ['Backspace'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
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
        button.setAttribute('aria-label', `letter ${index + 1}`);
        button.onclick = () => handleClick(button);
        button.textContent = letter;

        keyboardTile.appendChild(button);
        keyboardRow.appendChild(keyboardTile);
    });

    keyboardContainer.appendChild(keyboardRow);
});

document.body.appendChild(keyboardContainer);