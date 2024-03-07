import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoImage from '../../Components/Images/employee-portal.jpg';

function PDFGenerator({ columns, empSkills, employeeName, employeeId, Heading }) {
    useEffect(() => {
        
        const downloadPDF = async () => {
            const doc = new jsPDF('l');
            const text = Heading;
            const fontSize = 25;

            doc.setFont('times', 'bold');
            doc.setFontSize(fontSize);
            const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
            const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
            const headingY = 20;
            const tableY = headingY + 3;

            const bgImageWidth = 35;
const bgImageHeight = 35;
const xPosition = 60;
const yPosition = 0;


await addImageToPdf(doc, LogoImage, xPosition, yPosition, bgImageWidth, bgImageHeight);

            
            // Draw the heading text
            doc.text(text, textX, headingY);

            // Set up flex container for employee details
            const flexContainerY = tableY + 15;
            doc.setFont('times');
            doc.setFontSize(12);
            const EmployeeFullName = "Employee Name : " + employeeName;
            const EmployeeId = 'Employee ID : ' + employeeId
            const EmployeeFullNameWidth = doc.getStringUnitWidth(EmployeeFullName) * 12 / doc.internal.scaleFactor;
            doc.text(EmployeeFullName, 10, flexContainerY-4);
            const EmployeeIdWidth = doc.getStringUnitWidth(EmployeeId) * 12 / doc.internal.scaleFactor;
            const EmployeeIdX = doc.internal.pageSize.getWidth() - EmployeeIdWidth - 10;
            doc.text(EmployeeId, EmployeeIdX, flexContainerY -4);

            const convertedColumns = columns.map(column => ({
                header: column.field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Capitalize first letter and insert space before capital letters
                dataKey: column.field,
            }));

            const tableRows = empSkills.map(row => {
                return convertedColumns.map(column => {
                    if (typeof row[column.dataKey] === 'string' && row[column.dataKey].includes('T')) {

                        const date = new Date(row[column.dataKey]);
                        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                    } else {
                        return row[column.dataKey];
                    }
                });
            });

            // Generate the table
            await generateTable(doc, convertedColumns, tableRows, tableY + 18);
            
            // Save the PDF
            doc.save(`${employeeName} (${employeeId}) ${Heading}.pdf`);
        };

        downloadPDF();
    }, []);

    // Function to add image to PDF
    const addImageToPdf = (doc, image, x, y, width, height) => {
        return new Promise((resolve) => {
            doc.addImage(image, 'JPEG', x, y, width, height, undefined, 'FAST', 0.2);
            resolve();
        });
    };

    // Function to generate table
    const generateTable = (doc, columns, rows, startY) => {
        return new Promise((resolve) => {
            doc.autoTable({
                head: [columns.map(column => column.header)],
                body: rows,
                startY: startY,
                headStyles: {
                    font: 'emoji',
                },
            });
            resolve();
        });
    };

    return null; 
}

export default PDFGenerator;
