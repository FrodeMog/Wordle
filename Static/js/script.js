document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.RowContainer');
    const firstRowInputs = rows[0].querySelectorAll('input');
    let currentRow = 0;

    // Disable all inputs except those in the first row
    rows.forEach((row, index) => {
        if (index !== 0) {
            row.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });
        }
    });

    // Auto focus on next input in the current row
    rows.forEach((row) => {
        const inputs = row.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
        });
    });

    // Listen for 'Enter' key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const currentRowInputs = rows[currentRow].querySelectorAll('input');
            const isCurrentRowFull = Array.from(currentRowInputs).every(input => input.value.length === 1);

            // Enable inputs in the next row only if the current row is full
            if (isCurrentRowFull && currentRow < rows.length - 1) {
                currentRow++;
                rows[currentRow].querySelectorAll('input').forEach(input => {
                    input.disabled = false;
                });
                // Focus on the first input in the next row
                rows[currentRow].querySelector('input').focus();
            }
        }
    });
});