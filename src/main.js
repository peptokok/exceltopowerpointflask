import { setupDraggable } from './draggable';
import { handleExcelFile } from './excel';
import { exportToPowerPoint } from './powerpoint';
import { updateCanvasSize } from './canvas';
import { setupFormatPanel } from './formatPanel';

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        excelData: [],
        headers: [],
        elements: [],
        currentRatio: '16:9'
    };

    // Initialize Excel import
    const excelButton = document.querySelector('.excel-import');
    const excelInput = document.getElementById('excelFile');
    
    excelButton?.addEventListener('click', () => {
        excelInput?.click();
    });

    excelInput?.addEventListener('change', (event) => {
        handleExcelFile(event, state);
    });

    // Initialize PowerPoint export
    document.getElementById('exportButton')?.addEventListener('click', () => {
        exportToPowerPoint(state);
    });

    // Initialize aspect ratio buttons
    document.querySelectorAll('.ratio-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.ratio-button').forEach(btn => 
                btn.classList.remove('active'));
            e.target.closest('.ratio-button').classList.add('active');
            state.currentRatio = e.target.closest('.ratio-button').dataset.ratio;
            updateCanvasSize(state.currentRatio);
        });
    });

    // Initialize text box button
    document.getElementById('addTextBox')?.addEventListener('click', () => {
        const content = document.getElementById('canvasContent');
        const textBox = document.createElement('div');
        textBox.className = 'draggable text-box';
        textBox.contentEditable = true;
        textBox.setAttribute('data-placeholder', 'Click to add text');
        textBox.style.width = '200px';
        textBox.style.height = '40px';
        textBox.style.position = 'absolute';
        
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
        
        content.appendChild(textBox);
        state.elements.push(textBox);
        
        textBox.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.draggable').forEach(el => {
                el.classList.remove('selected');
            });
            textBox.classList.add('selected');
            showFormatPanel(e);
        });
    });

    // Initialize image button
    document.getElementById('addImage')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = document.getElementById('canvasContent');
                    const imageBox = document.createElement('div');
                    imageBox.className = 'draggable image-placeholder';
                    imageBox.style.width = '200px';
                    imageBox.style.height = '150px';
                    imageBox.style.backgroundImage = `url(${e.target?.result})`;
                    imageBox.style.backgroundSize = 'contain';
                    imageBox.style.backgroundRepeat = 'no-repeat';
                    imageBox.style.backgroundPosition = 'center';
                    
                    const contentRect = content.getBoundingClientRect();
                    const x = (contentRect.width - 200) / 2;
                    const y = (contentRect.height - 150) / 2;
                    
                    imageBox.style.transform = `translate(${x}px, ${y}px)`;
                    imageBox.setAttribute('data-x', x);
                    imageBox.setAttribute('data-y', y);
                    imageBox.setAttribute('data-image', e.target?.result);
                    
                    content.appendChild(imageBox);
                    state.elements.push(imageBox);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Initialize theme selector
    const themeSelector = document.getElementById('themeSelector');
    themeSelector?.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        const appContainer = document.querySelector('.app-container');
        appContainer?.setAttribute('data-theme', selectedTheme);
    });

    // Initialize draggable functionality
    setupDraggable(state);

    // Initialize format panel
    setupFormatPanel();

    // Set initial canvas size
    updateCanvasSize('16:9');

    // Handle window resize
    window.addEventListener('resize', () => updateCanvasSize(state.currentRatio));
});

function showFormatPanel(e) {
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
    }
}