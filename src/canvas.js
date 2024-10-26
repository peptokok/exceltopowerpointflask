const PIXELS_PER_CM = 37.795275591; // 1cm = 37.7953px
const DEFAULT_WIDTH_CM = 25.4; // 25.4 cm = 10 inches

const ASPECT_RATIOS = {
    '16:9': 16/9,
    '16:10': 16/10,
    '4:3': 4/3
};

export function updateCanvasSize(ratio) {
    const canvas = document.getElementById('presentationCanvas');
    const content = document.getElementById('canvasContent');
    
    if (!canvas || !content) return;

    // Get container dimensions
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 80; // Account for padding
    const containerHeight = container.clientHeight - 80;

    // Real dimensions in pixels (based on PowerPoint standard size)
    const realWidth = DEFAULT_WIDTH_CM * PIXELS_PER_CM;
    const aspectRatio = ASPECT_RATIOS[ratio] || ASPECT_RATIOS['16:9'];
    const realHeight = realWidth / aspectRatio;
    
    // Calculate scale to fit
    const scaleWidth = containerWidth / realWidth;
    const scaleHeight = containerHeight / realHeight;
    const scale = Math.min(scaleWidth, scaleHeight, 1); // Never scale up
    
    // Apply scaled dimensions
    const scaledWidth = realWidth * scale;
    const scaledHeight = realHeight * scale;
    
    // Update canvas size
    canvas.style.width = `${scaledWidth}px`;
    canvas.style.height = `${scaledHeight}px`;
    
    // Update content size and transform
    content.style.width = `${realWidth}px`;
    content.style.height = `${realHeight}px`;
    content.style.transform = `scale(${scale})`;
    
    // Store dimensions and scale for later use
    canvas.setAttribute('data-real-width', realWidth);
    canvas.setAttribute('data-real-height', realHeight);
    canvas.setAttribute('data-scale', scale);
    
    // Update all draggable elements to use real coordinates
    document.querySelectorAll('.draggable').forEach(element => {
        const x = parseFloat(element.getAttribute('data-x')) || 0;
        const y = parseFloat(element.getAttribute('data-y')) || 0;
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
}