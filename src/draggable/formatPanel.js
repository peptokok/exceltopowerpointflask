export function setupFormatPanelEvents() {
    setupFontControls();
    setupBorderControls();
    setupCloseButton();
    setupFontSearch();
    setupTextStyleButtons();
    
    document.getElementById('formatPanel')?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#formatPanel') && !e.target.classList.contains('draggable')) {
            const formatPanel = document.getElementById('formatPanel');
            if (formatPanel) {
                formatPanel.style.display = 'none';
            }
        }
    });
}

function setupFontControls() {
    const fontSelect = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');

    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (selected) {
                const font = e.target.value;
                selected.style.fontFamily = `"${font}", sans-serif`;
                selected.setAttribute('data-font-family', font);
            }
        });
    }

    if (fontSize) {
        fontSize.addEventListener('input', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (selected) {
                const size = parseInt(e.target.value);
                if (!isNaN(size)) {
                    selected.style.fontSize = `${size}px`;
                    selected.setAttribute('data-font-size', size);
                }
            }
        });
    }

    if (textColor) {
        textColor.addEventListener('input', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (selected) {
                const color = e.target.value;
                selected.style.color = color;
                selected.setAttribute('data-color', color);
            }
        });
    }
}

function setupBorderControls() {
    const borderStyle = document.getElementById('borderStyle');
    const borderWidth = document.getElementById('borderWidth');
    const borderColor = document.getElementById('borderColor');

    const updateBorder = () => {
        const selected = document.querySelector('.draggable.selected');
        if (selected && borderStyle && borderWidth && borderColor) {
            const style = borderStyle.value;
            const width = parseInt(borderWidth.value);
            const color = borderColor.value;

            if (style !== 'none') {
                selected.style.border = `${width}px ${style} ${color}`;
            } else {
                selected.style.border = 'none';
            }

            selected.setAttribute('data-border-style', style);
            selected.setAttribute('data-border-width', width);
            selected.setAttribute('data-border-color', color);
        }
    };

    borderStyle?.addEventListener('change', updateBorder);
    borderWidth?.addEventListener('input', updateBorder);
    borderColor?.addEventListener('input', updateBorder);
}

function setupCloseButton() {
    document.getElementById('closeFormatPanel')?.addEventListener('click', () => {
        const formatPanel = document.getElementById('formatPanel');
        if (formatPanel) {
            formatPanel.style.display = 'none';
        }
    });
}

function setupFontSearch() {
    const searchInput = document.getElementById('fontSearch');
    const fontSelect = document.getElementById('fontFamily');

    if (searchInput && fontSelect) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = fontSelect.options;
            
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const text = option.text.toLowerCase();
                const match = text.includes(searchTerm);
                option.style.display = match ? '' : 'none';
            }
        });
    }
}

function setupTextStyleButtons() {
    document.querySelectorAll('.style-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (!selected) return;

            const style = e.target.dataset.style;
            switch (style) {
                case 'bold':
                    selected.style.fontWeight = selected.style.fontWeight === 'bold' ? 'normal' : 'bold';
                    selected.setAttribute('data-font-weight', selected.style.fontWeight);
                    break;
                case 'italic':
                    selected.style.fontStyle = selected.style.fontStyle === 'italic' ? 'normal' : 'italic';
                    selected.setAttribute('data-font-style', selected.style.fontStyle);
                    break;
                case 'underline':
                    selected.style.textDecoration = selected.style.textDecoration === 'underline' ? 'none' : 'underline';
                    selected.setAttribute('data-text-decoration', selected.style.textDecoration);
                    break;
            }
            button.classList.toggle('active');
        });
    });
}

export function showFormatPanel(e) {
    const panel = document.getElementById('formatPanel');
    const element = e.target;
    
    if (panel) {
        const rect = element.getBoundingClientRect();
        panel.style.display = 'block';
        panel.style.left = `${rect.right + 10}px`;
        panel.style.top = `${rect.top}px`;
        
        updatePanelValues(element);
    }
}

function updatePanelValues(element) {
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const borderStyle = document.getElementById('borderStyle');
    const borderWidth = document.getElementById('borderWidth');
    const borderColor = document.getElementById('borderColor');
    
    const styles = window.getComputedStyle(element);
    
    if (fontFamily) fontFamily.value = element.getAttribute('data-font-family') || 'Arial';
    if (fontSize) fontSize.value = parseInt(element.getAttribute('data-font-size')) || 12;
    if (textColor) textColor.value = element.getAttribute('data-color') || '#000000';
    if (borderStyle) borderStyle.value = element.getAttribute('data-border-style') || 'none';
    if (borderWidth) borderWidth.value = parseInt(element.getAttribute('data-border-width')) || 1;
    if (borderColor) borderColor.value = element.getAttribute('data-border-color') || '#000000';

    document.querySelectorAll('.style-button').forEach(button => {
        const style = button.dataset.style;
        switch (style) {
            case 'bold':
                button.classList.toggle('active', styles.fontWeight === 'bold');
                break;
            case 'italic':
                button.classList.toggle('active', styles.fontStyle === 'italic');
                break;
            case 'underline':
                button.classList.toggle('active', styles.textDecoration.includes('underline'));
                break;
        }
    });
}</content>