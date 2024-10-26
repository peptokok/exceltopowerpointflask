export function createDraggableElement(content, columnIndex) {
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
        document.querySelectorAll('.draggable').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        showFormatPanel(e);
    });
    
    return element;
}

export function createTextBox(state) {
    const content = document.getElementById('canvasContent');
    const textBox = document.createElement('div');
    
    textBox.className = 'draggable text-box empty';
    textBox.contentEditable = true;
    textBox.style.width = '200px';
    textBox.style.height = '40px';
    textBox.style.color = '#000000';
    textBox.setAttribute('data-placeholder', 'Click to add text');
    
    const contentRect = content.getBoundingClientRect();
    const x = (contentRect.width - 200) / 2;
    const y = (contentRect.height - 40) / 2;
    
    textBox.style.transform = `translate(${x}px, ${y}px)`;
    textBox.setAttribute('data-x', x);
    textBox.setAttribute('data-y', y);
    textBox.setAttribute('data-font-family', 'Arial');
    textBox.setAttribute('data-font-size', '12');
    textBox.setAttribute('data-text-align', 'left');
    textBox.setAttribute('data-border-style', 'none');
    textBox.setAttribute('data-color', '#000000');
    
    textBox.addEventListener('input', () => {
        if (textBox.textContent.trim()) {
            textBox.classList.remove('empty');
        } else {
            textBox.classList.add('empty');
        }
    });
    
    textBox.addEventListener('focus', () => {
        if (textBox.classList.contains('empty')) {
            textBox.textContent = '';
        }
    });
    
    textBox.addEventListener('blur', () => {
        if (!textBox.textContent.trim()) {
            textBox.textContent = '';
            textBox.classList.add('empty');
        }
    });
    
    textBox.addEventListener('click', (e) => {
        document.querySelectorAll('.draggable').forEach(el => {
            el.classList.remove('selected');
        });
        textBox.classList.add('selected');
        showFormatPanel(e);
    });
    
    content.appendChild(textBox);
    state.elements.push(textBox);
    return textBox;
}