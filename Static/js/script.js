document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.RowContainer');
    let currentRow = 0;
    let testWord = "words";
    let wordToCheck = 'hunch';
    document.querySelector('.TileContainer input').focus();

    //API START
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
    //API END

    getRandomWord().then(word => {
        console.log(`The word to guess is: ${word}`);
        testWord = word;
    });
    

    // Disable all inputs except those in the first row
    rows.forEach((row, index) => {
        if (index !== 0) {
            row.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });
        }
    });

    // Auto focus on next input in each row and delete last tile with 'Backspace'
    rows.forEach((row, rowIndex) => {
        const inputs = row.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < inputs.length - 1 && rowIndex === currentRow) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace' && input.value === '' && index > 0) {
                    inputs[index - 1].value = '';
                    inputs[index - 1].focus();
                }
            });
        });
    });

    window.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return; //Return if not Enter key
    
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
    
            currentRowInputs.forEach(input => {
                input.disabled = true;
            });
    
            // First pass: check for green
            currentRowInputs.forEach((tile, tileIndex) => {
                let tileValue = tile.value.toLowerCase();
                if (tileValue === testWord.charAt(tileIndex).toLowerCase()) {
                    tile.style.backgroundColor = 'rgb(0, 150, 0)';
                    // Remove the letter from testWordCopy
                    testWordCopy[tileIndex] = '';
                }
            });
    
            // Second pass: check for yellow
            currentRowInputs.forEach((tile) => {
                let tileValue = tile.value.toLowerCase();
                if (tile.style.backgroundColor !== 'rgb(0, 150, 0)' && testWordCopy.includes(tileValue)) {
                    tile.style.backgroundColor = 'rgb(180, 180, 0)';
                    // Remove the first occurrence of the letter from testWordCopy
                    testWordCopy[testWordCopy.indexOf(tileValue)] = '';
                }
                let key = document.querySelector(`.KeyboardContainer .key[data-key="${tileValue}"]`);
                if (key) key.style.backgroundColor = 'rgb(180, 180, 180)';
            });
    
            // If the current row is not the last row, enable inputs in the next row
            if (currentRow < rows.length - 1) {
                currentRow++;
                rows[currentRow].querySelectorAll('input').forEach(input => {
                    input.disabled = false;
                });
                // Focus on the first input in the next row
                rows[currentRow].querySelector('input').focus();
            }
        });
    });
});