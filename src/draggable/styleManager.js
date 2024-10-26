export function applyStyles(element, styles) {
    for (const [property, value] of Object.entries(styles)) {
        // Apply the style directly to the element
        element.style[property] = value;
        
        // Store the value in a data attribute for PowerPoint export
        const dataAttr = `data-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        element.setAttribute(dataAttr, value);
    }

    // Handle border styles
    if (styles.borderStyle || styles.borderWidth || styles.borderColor) {
        const style = element.style.borderStyle || 'none';
        const width = element.style.borderWidth || '1px';
        const color = element.style.borderColor || '#000000';
        
        if (style !== 'none') {
            element.style.border = `${width} ${style} ${color}`;
        } else {
            element.style.border = 'none';
        }
    }
}