document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.RowContainer');
    let currentRow = 0;
    let testWord = "words";
    let wordToCheck = 'hunch';

    getRandomWord().then(word => {
        console.log(`The word to guess is: ${word}`);
        testWord = word;
    });
    
    // Disable all inputs
    rows.forEach((row) => {
        row.querySelectorAll('input').forEach(input => {
            input.disabled = true;
        });
    });

    // Handle onscreen keyboard
    window.handleClick = function(button) {
        let key = button.getAttribute('data-key');
        const currentRowInputs = rows[currentRow].querySelectorAll('input');
        const nextTile = Array.from(currentRowInputs).find(tile => tile.value === '');

        console.log(key);

        if(key === 'backspace') {
            handleBackspaceKey()
            return;
        }

        if(key === 'enter') {
            handleEnterKey();
            return;
        }
    
        if (nextTile) {
            nextTile.value = key;
        }
    }
    
    // Handle keyboard events
    window.addEventListener('keydown', (event) => {
        if (event.key == 'Enter'){
            handleEnterKey();
        }
        if (event.key == 'Backspace'){
            handleBackspaceKey();
        }
        handleLetterKeys(event);
    });

    //API
    function getRandomWord() {
        return fetch('/api/randomWord')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    
    function checkWord(wordToCheck) {
        return fetch(`/api/checkWord/${wordToCheck}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    
    //EVENTS
    function handleLetterKeys(event) {
        const currentRowInputs = rows[currentRow].querySelectorAll('input');
        const nextTile = Array.from(currentRowInputs).find(tile => tile.value === '');

        if (nextTile && /^[a-zA-Z]$/.test(event.key)) {
            nextTile.value = event.key.toUpperCase();
        }
    }


    function handleBackspaceKey() {
        const currentRowInputs = rows[currentRow].querySelectorAll('input');
        const previousTile = Array.from(currentRowInputs).reverse().find(tile => tile.value !== '');
        if (previousTile) {
            previousTile.value = '';
        }
    }

    function handleEnterKey() {
        const currentRowInputs = rows[currentRow].querySelectorAll('input');
        const isCurrentRowFull = Array.from(currentRowInputs).every(input => input.value.length === 1);
        let tileWord = Array.from(currentRowInputs).map(input => input.value.toLowerCase()).join('');
        let testWordCopy = testWord.split('');
    
        if (!isCurrentRowFull) return; // Return if the current row is not full
    
        checkWord(tileWord).then(data => {
            if (!data.exists) {
                console.log(`${tileWord} does not exist in the database.`);
                return; // Return if the word does not exist in the database
            }
            console.log(`${tileWord} exists in the database.`);

            // Check for grey
            currentRowInputs.forEach((tile) => {
                let tileValue = tile.value.toLowerCase();
                let key = document.querySelector(`.KeyboardContainer .key[data-key="${tileValue}"]`);
                if (key && key.style.backgroundColor !== 'rgb(0, 150, 0)' && key.style.backgroundColor !== 'rgb(180, 180, 0)') {
                    key.style.backgroundColor = 'rgb(150, 150, 150)';
                }
            });
    
            // Check for green
            currentRowInputs.forEach((tile, tileIndex) => {
                let tileValue = tile.value.toLowerCase();
                let key = document.querySelector(`.KeyboardContainer .key[data-key="${tileValue}"]`);
                if (tileValue === testWord.charAt(tileIndex).toLowerCase()) {
                    tile.style.backgroundColor = 'rgb(0, 150, 0)';
                    // Remove the letter from testWordCopy
                    testWordCopy[tileIndex] = '';
                    if (key) key.style.backgroundColor = 'rgb(0, 150, 0)';
                }
            });

            // Check for yellow
            currentRowInputs.forEach((tile) => {
                let tileValue = tile.value.toLowerCase();
                let key = document.querySelector(`.KeyboardContainer .key[data-key="${tileValue}"]`);
                if (tile.style.backgroundColor !== 'rgb(0, 150, 0)' && testWordCopy.includes(tileValue)) {
                    tile.style.backgroundColor = 'rgb(180, 180, 0)';
                    // Remove the first occurrence of the letter from testWordCopy
                    testWordCopy[testWordCopy.indexOf(tileValue)] = '';
                    if (key && key.style.backgroundColor !== 'rgb(0, 150, 0)') {
                        key.style.backgroundColor = 'rgb(180, 180, 0)';
                    }
                }
            });
    
            if (currentRow < rows.length - 1) {
                currentRow++;
            }
        });
    }
});