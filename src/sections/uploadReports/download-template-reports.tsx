import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { apiTemplates } from 'src/actions/templates';
import { apiInfoStudents } from 'src/actions/info_students';

// Tailwind CSS is assumed to be available
const DownloadTemplateReports = () => {
  const COLUMNS = 21;

  const { data: students } = useSuspenseQuery(apiInfoStudents()) || {};
  const { data: templates } = useSuspenseQuery(apiTemplates()) || {};
  const templateNames = templates?.map((template) => template?.event_name);

  console.log({ templateNames });

  const handleDownload = () => {
    const generateEmptyCells = (tag: string) => {
      let cells = '';
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < COLUMNS; i++) {
        cells += `<${tag}></${tag}>`;
      }
      return cells;
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>רשימת תלמידים</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; font-size: 12px; }
          table { border-collapse: collapse; width: 100%; text-align: right; table-layout: fixed; }
          th, td { border: 1px solid black; padding: 4px; }
          .header-row th { background-color: #f2f2f2; }
          .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        ${templateNames
          .map(
            (name, index) => `
          <div style="direction: rtl;">
            ${index + 1}-${name}
          </div>
        `
          )
          .join('')}
        <div class="title">רשימת תלמידים</div>
        <table>
          <thead>
            <tr>
              <th colspan="2">יום</th>
              ${generateEmptyCells('th')}
            </tr>
            <tr>
              <th colspan="2">סדר</th>
              ${generateEmptyCells('th')}
            </tr>
            <tr class="header-row">
              <th>מזהה</th>
              <th>שם</th>
               ${generateEmptyCells('th')}
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (student, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${student.שם} ${student?.משפחה}</td>
                ${generateEmptyCells('td')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a Blob from the content with the specific MIME type for .docx
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'StudentList.docx';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Button to download the document */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors duration-200"
          >
            הורד תבנית
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplateReports;
