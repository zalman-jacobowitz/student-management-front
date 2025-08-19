import { Typography } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

interface JsonEditorComponentProps {
  initialParsedData: {
    fileName: string;
    json: any;
  }[];
  onDataChange: (data: any) => void;
}

async function uploadData(dataToSend: any) {
  try {
    const response = await fetch('http://localhost:8080/upload_scan_reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);
    // Handle success, maybe show a message to the user
  } catch (error) {
    console.error('Error:', error);
    // Handle errors, maybe show an error message
  }
}

const JsonEditorComponent: React.FC<JsonEditorComponentProps> = ({
  initialParsedData,
  onDataChange,
}) => {
  const [editedData, setEditedData] = useState<any>([]);
  const debounceTimerRef = useRef(null); // Ref to store the debounce timer

  useEffect(() => {
    // Perform a deep copy to ensure edits don't affect the original data until saved.
    setEditedData(JSON.parse(JSON.stringify(initialParsedData)));
  }, [initialParsedData]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer to call onDataChange after a delay
    // Only call onDataChange if editedData is not null/empty (e.g., after initial load)
    if (editedData.length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        onDataChange(editedData);
        console.log('Debounced data sent to parent:', editedData);
      }, 500); // Debounce delay of 500ms
    }

    // Cleanup function: clear the timer when the component unmounts or editedData changes again
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [editedData, onDataChange]); // Depend on editedData and onDataChange

  // Handle changes to the general document text for a specific file.
  const handleDocumentTextChange = (fileIndex, newText) => {
    setEditedData((prevData) =>
      prevData.map((item, idx) =>
        idx === fileIndex ? { ...item, json: { ...item.json, document_text: newText } } : item
      )
    );
  };

  // Handle changes to a specific table cell.
  const handleTableCellChange = (fileIndex, tableIndex, rowIndex, colIndex, newValue) => {
    setEditedData((prevData) =>
      prevData.map((fileItem, fIdx) => {
        if (fIdx === fileIndex) {
          const updatedTables = fileItem.json.tables.map((table, tIdx) => {
            if (tIdx === tableIndex) {
              const updatedRows = table.rows.map((row, rIdx) => {
                if (rIdx === rowIndex) {
                  const updatedRow = [...row];
                  updatedRow[colIndex] = newValue;
                  return updatedRow;
                }
                return row;
              });
              return { ...table, rows: updatedRows };
            }
            return table;
          });
          return { ...fileItem, json: { ...fileItem.json, tables: updatedTables } };
        }
        return fileItem;
      })
    );
  };

  // Handle removing an entire table from a specific file.
  const handleRemoveTable = (fileIndex, tableIndex) => {
    setEditedData((prevData) =>
      prevData.map((fileItem, fIdx) => {
        if (fIdx === fileIndex) {
          const updatedTables = fileItem.json.tables.filter((_, tIdx) => tIdx !== tableIndex);
          return { ...fileItem, json: { ...fileItem.json, tables: updatedTables } };
        }
        return fileItem;
      })
    );
  };

  const onUpload = () => {
    uploadData(editedData[0]?.json?.tables);
  };

  return (
    <>
        <Typography variant="h4" component="h1" gutterBottom>
          סיכום ועריכה
        </Typography>

        {editedData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>אין מידע להציג</p>
        ) : (
          editedData.map((fileItem, fileIndex) => (
            <div
              key={fileIndex}
              style={{
                marginBottom: '2.5rem',
                padding: '1.5rem',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                backgroundColor: '#eff6ff',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e40af',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>קובץ: {fileItem.fileName}</span>
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#4b5563',
                    marginBottom: '0.5rem',
                  }}
                >
                  פרטים:
                </h3>
                <textarea
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(96, 165, 250, 0)',
                  }}
                  rows={4}
                  value={fileItem.json.document_text || ''}
                  onChange={(e) => handleDocumentTextChange(fileIndex, e.target.value)}
                />
              </div>

              {/* Tables Section */}
              {fileItem.json.tables && fileItem.json.tables.length > 0 && (
                <div style={{ marginBottom: '1.5rem' /* mb-6 */ }}>
                  <h3
                    style={{
                      fontSize: '1.25rem' /* text-xl */,
                      fontWeight: '600' /* font-semibold */,
                      color: '#4b5563',
                      marginBottom: '1rem' /* mb-4 */,
                    }}
                  >
                    טבלת תלמידים:
                  </h3>
                  {fileItem.json.tables.map((table, tableIndex) => (
                    <div
                      key={tableIndex}
                      style={{
                        marginBottom: '2rem' /* mb-8 */,
                        padding: '1rem' /* p-4 */,
                        border: '1px solid #bbf7d0' /* border border-green-200 */,
                        borderRadius: '0.5rem',
                        backgroundColor: '#f0fdf4' /* bg-green-50 */,
                        position: 'relative',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveTable(fileIndex, tableIndex)}
                        style={{
                          position: 'absolute',
                          top: '1rem' /* top-4 */,
                          right: '1rem' /* right-4 */,
                          backgroundColor: '#ef4444' /* bg-red-500 */,
                          color: '#ffffff' /* text-white */,
                          padding: '0.5rem' /* p-2 */,
                          borderRadius: '9999px' /* rounded-full */,
                          fontSize: '0.875rem' /* text-sm */,
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' /* shadow-md */,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease-in-out',
                        }}
                        title="Remove Table"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ height: '1rem', width: '1rem' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>

                      <div style={{ overflowX: 'auto' }}>
                        <table
                          style={{
                            minWidth: '100%',
                            backgroundColor: '#ffffff' /* bg-white */,
                            borderRadius: '0.5rem',
                            boxShadow: '0 1pxa(0, 0, 0, 0.05)' /* shadow-sm */,
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: '#f8fafc' /* bg-gray-100 */,
                                borderBottom: '1px solid #e2e8f0' /* border-b border-gray-200 */,
                              }}
                            >
                              {table.headers
                                .slice()
                                .reverse()
                                .map((header, colIndex) => (
                                  <th
                                    key={colIndex}
                                    style={{
                                      padding: '0.5rem 1rem' /* py-2 px-4 */,
                                      textAlign: 'right',
                                      fontSize: '0.875rem' /* text-sm */,
                                      fontWeight: '600' /* font-semibold */,
                                      color: '#4b5563' /* text-gray-600 */,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em' /* tracking-wider */,
                                      borderLeft:
                                        colIndex > 0 ? '1px solid #e2e8f0' : 'none' /* border-l */,
                                    }}
                                  >
                                    {header}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                style={{
                                  borderBottom: '1px solid #f1f5f9' /* border-b border-gray-100 */,
                                }}
                              >
                                {row
                                  .slice()
                                  .reverse()
                                  .map((cell, colIndex) => (
                                    <td
                                      key={colIndex}
                                      style={{
                                        padding: '0.5rem 1rem' /* py-2 px-4 */,
                                        textAlign: 'right',
                                        fontSize: '0.875rem' /* text-sm */,
                                        color: '#374151' /* text-gray-800 */,
                                        borderLeft:
                                          colIndex > 0
                                            ? '1px solid #f1f5f9'
                                            : 'none' /* border-l */,
                                      }}
                                    >
                                      <input
                                        type="text"
                                        style={{
                                          width: '100%',
                                          padding: '0.25rem',
                                          border: '1px solid #e2e8f0',
                                          borderRadius: '0.25rem',
                                          outline: 'none',
                                          boxShadow: '0 0 0 1px rgba(96, 165, 250, 0)',
                                        }}
                                        value={cell || ''}
                                        onChange={(e) =>
                                          handleTableCellChange(
                                            fileIndex,
                                            tableIndex,
                                            rowIndex,
                                            colIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                  ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <button
            type="button"
            onClick={onUpload}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              color: '#4b5563',
              border: '1px solid #d1d5db',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            העלה
          </button>
        </div>
      </>
  );
};

export default JsonEditorComponent;
