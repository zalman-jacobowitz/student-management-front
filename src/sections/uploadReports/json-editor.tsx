import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { EmptyContent } from 'src/components/empty-content';
import { UploadTableView } from './upload-table-view';

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

  const notFound = editedData.length === 0;

  return (
    <>
        <Typography variant="h4" component="h1" gutterBottom>
          סיכום ועריכה
        </Typography>

        { notFound ? (
          <EmptyContent title='לא נמצאו נתונים לעריכה' />
        ) : (
          editedData.map((fileItem, fileIndex) => (
            <Card key={fileIndex}>
              <CardHeader title={`קובץ: ${fileItem.fileName}`} />
              <CardContent>
          {/*
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
        */}

              {/* Tables Section */}
              {fileItem.json.tables && fileItem.json.tables.length > 0 && (
                <div style={{ marginBottom: '1.5rem' /* mb-6 */ }}>
                  {fileItem.json.tables.map((table, tableIndex) => (
                    <UploadTableView
                      key={tableIndex}
                      tableIndex={tableIndex}
                      handleRemoveTable={handleRemoveTable}
                      table={table}
                      fileIndex={fileIndex}
                      handleTableCellChange={handleTableCellChange}
                    />
                  ))}
                </div>

              )}
              </CardContent>
            </Card>
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
