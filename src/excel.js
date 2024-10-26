import * as XLSX from 'xlsx';

export function handleExcelFile(event, state) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        state.headers = jsonData[0];
        state.excelData = jsonData;

        displayColumns(state.headers);
    };

    reader.readAsArrayBuffer(file);
}

function displayColumns(headers) {
    const columnList = document.getElementById('columnList');
    columnList.innerHTML = '';

    headers.forEach((header, index) => {
        const columnItem = document.createElement('div');
        columnItem.className = 'column-item';
        columnItem.textContent = header;
        columnItem.setAttribute('data-column', index);
        columnList.appendChild(columnItem);
    });
}