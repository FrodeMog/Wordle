document.addEventListener('DOMContentLoaded', (event) => {
    const inputs = document.querySelectorAll('.TileContainer input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
});