function generateGameContainer() {
    let gameContainer = document.createElement('div');
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

document.body.appendChild(generateGameContainer());