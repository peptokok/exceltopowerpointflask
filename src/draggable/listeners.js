const PIXELS_PER_CM = 37.795275591; // 1cm = 37.7953px

export function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

export function resizeListener(event) {
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

export function setupSizeControls() {
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
}</content>