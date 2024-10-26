export function setupFormatPanel() {
    const formatPanel = document.getElementById('formatPanel');
    if (!formatPanel) return;

    // Font family control
    const fontFamily = document.getElementById('fontFamily');
    fontFamily?.addEventListener('change', (e) => {
        const selected = document.querySelector('.draggable.selected');
        if (selected) {
            const font = e.target.value;
            selected.style.fontFamily = font;
            selected.setAttribute('data-font-family', font);
        }
    });

    // Font size control
    const fontSize = document.getElementById('fontSize');
    fontSize?.addEventListener('input', (e) => {
        const selected = document.querySelector('.draggable.selected');
        if (selected) {
            const size = e.target.value;
            selected.style.fontSize = `${size}px`;
            selected.setAttribute('data-font-size', size);
        }
    });

    // Text color control
    const textColor = document.getElementById('textColor');
    textColor?.addEventListener('input', (e) => {
        const selected = document.querySelector('.draggable.selected');
        if (selected) {
            const color = e.target.value;
            selected.style.color = color;
            selected.setAttribute('data-color', color);
        }
    });

    // Border controls
    const borderStyle = document.getElementById('borderStyle');
    const borderWidth = document.getElementById('borderWidth');
    const borderColor = document.getElementById('borderColor');

    const updateBorder = () => {
        const selected = document.querySelector('.draggable.selected');
        if (!selected || !borderStyle || !borderWidth || !borderColor) return;

        const style = borderStyle.value;
        const width = borderWidth.value;
        const color = borderColor.value;

        if (style === 'none') {
            selected.style.border = 'none';
        } else {
            selected.style.border = `${width}px ${style} ${color}`;
        }

        selected.setAttribute('data-border-style', style);
        selected.setAttribute('data-border-width', width);
        selected.setAttribute('data-border-color', color);
    };

    borderStyle?.addEventListener('change', updateBorder);
    borderWidth?.addEventListener('input', updateBorder);
    borderColor?.addEventListener('input', updateBorder);

    // Font search
    const fontSearch = document.getElementById('fontSearch');
    fontSearch?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = fontFamily?.options;
        if (!options) return;

        Array.from(options).forEach(option => {
            const text = option.text.toLowerCase();
            option.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Style buttons (Bold, Italic, Underline)
    document.querySelectorAll('.style-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (!selected) return;

            const style = e.target.dataset.style;
            switch (style) {
                case 'bold':
                    selected.style.fontWeight = selected.style.fontWeight === 'bold' ? 'normal' : 'bold';
                    break;
                case 'italic':
                    selected.style.fontStyle = selected.style.fontStyle === 'italic' ? 'normal' : 'italic';
                    break;
                case 'underline':
                    selected.style.textDecoration = selected.style.textDecoration === 'underline' ? 'none' : 'underline';
                    break;
            }
            e.target.classList.toggle('active');
        });
    });

    // Close button
    document.getElementById('closeFormatPanel')?.addEventListener('click', () => {
        formatPanel.style.display = 'none';
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!formatPanel.contains(e.target) && !e.target.classList.contains('draggable')) {
            formatPanel.style.display = 'none';
        }
    });
}