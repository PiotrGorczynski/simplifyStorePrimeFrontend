import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {}

  exportToPDF(data: any[], fileName: string, title: string): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => headers.map(key => {
      const value = item[key];
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (Array.isArray(value)) {
        return `${value.length} items`;
      }
      return String(value ?? '');
    }));

    autoTable(doc, {
      head: [headers.map(h => h.toUpperCase())],
      body: rows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [124, 77, 255] }
    });

    doc.save(`${fileName}.pdf`);
  }

  exportToExcel(data: any[], filename: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  exportToCSV(data: any[], filename: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    this.downloadFile(csv, `${filename}.csv`, 'text/csv');
  }

  exportToJSON(data: any[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `${filename}.json`, 'application/json');
  }

  exportToHTML(data: any[], filename: string, title: string): void {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = Object.keys(data[0]);
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #7c4dff; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th { background-color: #7c4dff; color: white; padding: 12px; text-align: left; }
    td { border: 1px solid #ddd; padding: 10px; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    tr:hover { background-color: #e8e8ff; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h.toUpperCase()}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
`;

    data.forEach(row => {
      html += '<tr>';
      headers.forEach(header => {
        let value = row[header];

        if (value instanceof Date) {
          value = value.toLocaleDateString();
        }

        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }

        html += `<td>${value !== null && value !== undefined ? value : ''}</td>`;
      });
      html += '</tr>';
    });

    html += `
    </tbody>
  </table>
  <p style="margin-top: 20px; color: #666;">
    Generated on ${new Date().toLocaleString()} | Simplify Store Prime
  </p>
</body>
</html>
`;

    this.downloadFile(html, `${filename}.html`, 'text/html');
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
