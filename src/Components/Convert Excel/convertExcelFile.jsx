import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';

function ConvertExcelFile({ data, employeeName,employeeId,DetailsName ,columns}) {
  useEffect(() => {
    const convertToExcel = () => {
        const filename = `${employeeName}(${employeeId})_${DetailsName}.xlsx`;
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([]);
        const headingStyle = {
            font: { bold: true, sz: 18, name: 'Arial' }, // bold, Arial font, size 18
        };
        const headingRow = columns.map(column => column.headerName);
        XLSX.utils.sheet_add_aoa(ws, [headingRow], { origin: 'A1' });
    
        for (let C = 0; C < headingRow.length; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            ws[cell_ref].s = headingStyle;
        }

        const convertedColumns = columns.map(column => ({
            dataKey: column.field,
        }));
        const dataRows = data.map(row => {
            return convertedColumns.map(column => {
                if (typeof row[column.dataKey] === 'string' && row[column.dataKey].includes('T')) {
                    const date = new Date(row[column.dataKey]);
                    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                } else {
                    return row[column.dataKey];
                }
            });
        });

        XLSX.utils.sheet_add_aoa(ws, dataRows, { skipHeader: true, origin: 'A2' });
        XLSX.utils.book_append_sheet(wb, ws, DetailsName);
        XLSX.writeFile(wb, filename);
    };

    convertToExcel();
  }, []);

  return null;
}

export default ConvertExcelFile;
