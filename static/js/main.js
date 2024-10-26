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

    excelInput?.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload-excel', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            state.headers = data.headers;
            state.excelData = [data.headers, ...data.data];
            displayColumns(state.headers);
        } catch (error) {
            console.error('Error uploading Excel:', error);
            alert('Failed to upload Excel file');
        }
    });

    // Initialize PowerPoint export
    document.getElementById('exportButton')?.addEventListener('click', async () => {
        const elements = Array.from(document.querySelectorAll('.draggable')).map(element => ({
            type: element.classList.contains('image-placeholder') ? 'image' : 'text',
            x: parseFloat(element.getAttribute('data-x')) || 0,
            y: parseFloat(element.getAttribute('data-y')) || 0,
            width: parseFloat(element.getAttribute('data-width')) || element.offsetWidth,
            height: parseFloat(element.getAttribute('data-height')) || element.offsetHeight,
            text: element.textContent,
            columnIndex: element.getAttribute('data-column'),
            fontFamily: element.getAttribute('data-font-family'),
            fontSize: element.getAttribute('data-font-size'),
            color: element.getAttribute('data-color'),
            textAlign: element.getAttribute('data-text-align'),
            bold: element.style.fontWeight === 'bold',
            italic: element.style.fontStyle === 'italic',
            underline: element.style.textDecoration === 'underline',
            imageData: element.getAttribute('data-image')
        }));

        try {
            const response = await fetch('/export-pptx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    elements,
                    ratio: state.currentRatio,
                    excelData: state.excelData
                })
            });

            if (!response.ok) throw new Error('Export failed');

            // Create a blob from the response and download it
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'presentation.pptx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting PowerPoint:', error);
            alert('Failed to export PowerPoint file');
        }
    });

    // Rest of the JavaScript code remains the same as in the original version
    // (Including aspect ratio buttons, text box creation, image handling, etc.)
    // Just remove any Node.js specific code and keep the browser-side JavaScript
});

function displayColumns(headers) {
    const columnList = document.getElementById('columnList');
    if (!columnList) return;

    columnList.innerHTML = '<h3>Excel Columns</h3>';
    
    headers.forEach((header, index) => {
        const columnItem = document.createElement('div');
        columnItem.className = 'column-item';
        columnItem.textContent = header;
        columnItem.setAttribute('data-column', index);
        columnItem.draggable = true;
        columnList.appendChild(columnItem);
    });
}