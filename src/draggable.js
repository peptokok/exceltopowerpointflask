import interact from 'interactjs';

const PIXELS_PER_CM = 37.795275591; // 1cm = 37.7953px

export function setupDraggable(state) {
    setupColumnDraggable(state);
    setupElementDraggable();
    setupImageDraggable(state);
    setupKeyboardEvents();
    setupAlignmentButtons();
    setupSizeControls();
}

function setupColumnDraggable(state) {
    interact('.column-item').draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
            start(event) {
                const clone = createDraggableElement(
                    event.target.textContent,
                    event.target.getAttribute('data-column')
                );
                document.getElementById('canvasContent').appendChild(clone);
                event.target.setAttribute('data-clone-id', state.elements.length);
                state.elements.push(clone);
            },
            move(event) {
                dragMoveListener(event);
            },
            end(event) {
                // Return the column item to its original position
                event.target.style.transform = '';
                event.target.removeAttribute('data-x');
                event.target.removeAttribute('data-y');
            }
        }
    });
}

function setupElementDraggable() {
    interact('.draggable').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent'
            })
        ],
        listeners: {
            move: dragMoveListener
        }
    }).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
            interact.modifiers.restrictSize({
                min: { width: 100, height: 30 }
            })
        ],
        listeners: {
            move: resizeListener
        }
    });
}

function setupImageDraggable(state) {
    interact('#imageIcon').draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
            start() {
                createImagePlaceholder(state);
            },
            move(event) {
                dragMoveListener(event);
            }
        }
    });
}

function setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const selected = document.querySelector('.draggable.selected');
            if (selected) {
                selected.remove();
            }
        }
    });
}

function setupAlignmentButtons() {
    document.querySelectorAll('.alignment-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selected = document.querySelector('.draggable.selected');
            if (selected) {
                const align = e.target.dataset.align;
                selected.style.textAlign = align;
                selected.setAttribute('data-text-align', align);
                
                document.querySelectorAll('.alignment-button').forEach(btn => 
                    btn.classList.toggle('active', btn.dataset.align === align));
            }
        });
    });
}

function setupSizeControls() {
    const widthInput = document.getElementById('elementWidth');
    const heightInput = document.getElementById('elementHeight');

    const updateElementSize = (element) => {
        if (!element) return;
        
        const widthCm = parseFloat(widthInput.value);
        const heightCm = parseFloat(heightInput.value);
        
        if (isNaN(widthCm) || isNaN(heightCm)) return;
        
        const widthPx = Math.round(widthCm * PIXELS_PER_CM);
        const heightPx = Math.round(heightCm * PIXELS_PER_CM);
        
        element.style.width = `${widthPx}px`;
        element.style.height = `${heightPx}px`;
        element.setAttribute('data-width', widthPx);
        element.setAttribute('data-height', heightPx);
    };

    const handleSizeInput = () => {
        const selected = document.querySelector('.draggable.selected');
        if (selected) {
            updateElementSize(selected);
        }
    };

    if (widthInput) {
        widthInput.addEventListener('input', handleSizeInput);
        widthInput.addEventListener('change', handleSizeInput);
    }
    
    if (heightInput) {
        heightInput.addEventListener('input', handleSizeInput);
        heightInput.addEventListener('change', handleSizeInput);
    }

    // Update size inputs when element is selected
    document.addEventListener('click', (e) => {
        const element = e.target.closest('.draggable');
        if (element) {
            const width = parseFloat(element.getAttribute('data-width') || element.offsetWidth);
            const height = parseFloat(element.getAttribute('data-height') || element.offsetHeight);
            
            if (widthInput) widthInput.value = (width / PIXELS_PER_CM).toFixed(1);
            if (heightInput) heightInput.value = (height / PIXELS_PER_CM).toFixed(1);
        }
    });
}

function createDraggableElement(content, columnIndex) {
    const element = document.createElement('div');
    element.className = 'draggable';
    element.textContent = content;
    element.setAttribute('data-column', columnIndex);
    element.setAttribute('data-font-family', 'Arial');
    element.setAttribute('data-font-size', '12');
    element.setAttribute('data-text-align', 'left');
    element.setAttribute('data-border-style', 'none');
    element.setAttribute('data-color', '#000000');
    element.style.textAlign = 'left';
    element.style.color = '#000000';
    
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.draggable').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        showFormatPanel(e);
    });
    
    return element;
}

function createImagePlaceholder(state) {
    const content = document.getElementById('canvasContent');
    const placeholder = document.createElement('div');
    
    placeholder.className = 'draggable image-placeholder';
    placeholder.style.width = '200px';
    placeholder.style.height = '150px';
    
    placeholder.addEventListener('click', handleImageClick);
    content.appendChild(placeholder);
    state.elements.push(placeholder);
}

function handleImageClick(e) {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.style.backgroundImage = `url(${e.target.result})`;
                this.setAttribute('data-image', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function resizeListener(event) {
    const target = event.target;
    let x = parseFloat(target.getAttribute('data-x')) || 0;
    let y = parseFloat(target.getAttribute('data-y')) || 0;

    const width = event.rect.width;
    const height = event.rect.height;

    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.setAttribute('data-width', width);
    target.setAttribute('data-height', height);

    // Update size controls with cm values
    const widthCm = (width / PIXELS_PER_CM).toFixed(1);
    const heightCm = (height / PIXELS_PER_CM).toFixed(1);
    
    const widthInput = document.getElementById('elementWidth');
    const heightInput = document.getElementById('elementHeight');
    
    if (widthInput) widthInput.value = widthCm;
    if (heightInput) heightInput.value = heightCm;

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

export function showFormatPanel(e) {
    const panel = document.getElementById('formatPanel');
    const element = e.target.closest('.draggable');
    
    if (panel && element) {
        const rect = element.getBoundingClientRect();
        panel.style.display = 'block';
        panel.style.left = `${rect.right + 10}px`;
        panel.style.top = `${rect.top}px`;
        
        // Update panel values
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        const textColor = document.getElementById('textColor');
        const borderStyle = document.getElementById('borderStyle');
        const borderWidth = document.getElementById('borderWidth');
        const borderColor = document.getElementById('borderColor');
        
        if (fontFamily) fontFamily.value = element.getAttribute('data-font-family') || 'Arial';
        if (fontSize) fontSize.value = element.getAttribute('data-font-size') || '12';
        if (textColor) textColor.value = element.getAttribute('data-color') || '#000000';
        if (borderStyle) borderStyle.value = element.getAttribute('data-border-style') || 'none';
        if (borderWidth) borderWidth.value = element.getAttribute('data-border-width') || '1';
        if (borderColor) borderColor.value = element.getAttribute('data-border-color') || '#000000';

        // Update style buttons
        const styles = window.getComputedStyle(element);
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
    }
}