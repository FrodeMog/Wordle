document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.RowContainer');
    let currentRow = 0;
    const testWord = "words";

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

    // Listen for 'Enter' key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const currentRowInputs = rows[currentRow].querySelectorAll('input');
            const isCurrentRowFull = Array.from(currentRowInputs).every(input => input.value.length === 1);

            // Change color for green correct letter and tile placement
            currentRowInputs.forEach((tile, tileIndex) => {
                console.log(tile.value)
                if (tile.value.toLowerCase() === testWord.charAt(tileIndex).toLowerCase()) {
                    tile.style.backgroundColor = 'green';
                }
            });

            // If the current row is full
            if (isCurrentRowFull) {
                // Disable inputs in the current row
                currentRowInputs.forEach(input => {
                    input.disabled = true;
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
            }
        }
    });
});