import PptxGenJS from 'pptxgenjs';

const PIXELS_PER_CM = 37.795275591; // 1cm = 37.7953pt
const POINTS_PER_CM = 28.3464567; // 1cm = 28.3465pt

export async function exportToPowerPoint(state) {
    const pptx = new PptxGenJS();
    const content = document.getElementById('canvasContent');
    
    if (!content) {
        console.error('Canvas content not found');
        return;
    }

    // Set slide size based on ratio
    pptx.layout = state.currentRatio === '16:9' ? 'LAYOUT_16x9' : 
                  state.currentRatio === '16:10' ? 'LAYOUT_16x10' : 'LAYOUT_4x3';

    // Create slides based on Excel data
    if (state.excelData && state.excelData.length > 1) {
        // Skip header row
        for (let i = 1; i < state.excelData.length; i++) {
            const rowData = state.excelData[i];
            const slide = pptx.addSlide();
            
            // Get all draggable elements
            const elements = Array.from(content.querySelectorAll('.draggable'));
            
            for (const element of elements) {
                const columnIndex = element.getAttribute('data-column');
                
                // Get element position and size
                const transform = element.style.transform;
                const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                if (!match) continue;
                
                const width = parseFloat(element.getAttribute('data-width')) || element.offsetWidth;
                const height = parseFloat(element.getAttribute('data-height')) || element.offsetHeight;
                
                // Convert pixels to inches (1 inch = 72 points)
                const x = parseFloat(match[1]) / PIXELS_PER_CM / 2.54;
                const y = parseFloat(match[2]) / PIXELS_PER_CM / 2.54;
                const w = width / PIXELS_PER_CM / 2.54;
                const h = height / PIXELS_PER_CM / 2.54;
                
                // Create shape options
                const options = {
                    x,
                    y,
                    w,
                    h,
                    fontSize: parseInt(element.getAttribute('data-font-size')) || 12,
                    fontFace: element.getAttribute('data-font-family') || 'Arial',
                    color: (element.getAttribute('data-color') || '#000000').replace('#', ''),
                    align: element.getAttribute('data-text-align') || 'left',
                    valign: 'middle',
                    fill: { color: 'FFFFFF' }
                };

                // Apply text styles
                if (element.style.fontWeight === 'bold') options.bold = true;
                if (element.style.fontStyle === 'italic') options.italic = true;
                if (element.style.textDecoration === 'underline') options.underline = true;

                // Apply border styles
                const borderStyle = element.getAttribute('data-border-style');
                if (borderStyle && borderStyle !== 'none') {
                    const borderColor = element.getAttribute('data-border-color');
                    const borderWidth = parseInt(element.getAttribute('data-border-width'));
                    
                    options.line = {
                        color: (borderColor || '#000000').replace('#', ''),
                        pt: borderWidth || 1,
                        type: borderStyle === 'dashed' ? 'dash' : 
                              borderStyle === 'dotted' ? 'dot' : 'solid'
                    };
                }

                // Handle different element types
                if (element.classList.contains('image-placeholder')) {
                    const imageData = element.getAttribute('data-image');
                    if (imageData) {
                        slide.addImage({
                            data: imageData,
                            x: options.x,
                            y: options.y,
                            w: options.w,
                            h: options.h
                        });
                    }
                } else {
                    // For text elements, use the Excel data if column is specified
                    let text = element.textContent;
                    if (columnIndex !== null && columnIndex !== undefined) {
                        text = rowData[columnIndex] || '';
                    }
                    slide.addText(text, options);
                }
            }
        }
    } else {
        // If no Excel data, create a single slide with the current layout
        const slide = pptx.addSlide();
        const elements = Array.from(content.querySelectorAll('.draggable'));
        
        for (const element of elements) {
            const transform = element.style.transform;
            const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
            if (!match) continue;
            
            const width = parseFloat(element.getAttribute('data-width')) || element.offsetWidth;
            const height = parseFloat(element.getAttribute('data-height')) || element.offsetHeight;
            
            const x = parseFloat(match[1]) / PIXELS_PER_CM / 2.54;
            const y = parseFloat(match[2]) / PIXELS_PER_CM / 2.54;
            const w = width / PIXELS_PER_CM / 2.54;
            const h = height / PIXELS_PER_CM / 2.54;
            
            const options = {
                x,
                y,
                w,
                h,
                fontSize: parseInt(element.getAttribute('data-font-size')) || 12,
                fontFace: element.getAttribute('data-font-family') || 'Arial',
                color: (element.getAttribute('data-color') || '#000000').replace('#', ''),
                align: element.getAttribute('data-text-align') || 'left',
                valign: 'middle',
                fill: { color: 'FFFFFF' }
            };

            if (element.classList.contains('image-placeholder')) {
                const imageData = element.getAttribute('data-image');
                if (imageData) {
                    slide.addImage({
                        data: imageData,
                        x: options.x,
                        y: options.y,
                        w: options.w,
                        h: options.h
                    });
                }
            } else {
                slide.addText(element.textContent || '', options);
            }
        }
    }

    try {
        await pptx.writeFile('presentation.pptx');
    } catch (error) {
        console.error('Error exporting PowerPoint:', error);
    }
}