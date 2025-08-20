import React, { useRef, useState, useEffect } from 'react';
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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem' /* p-4 */,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem 2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '64rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            textAlign: 'center',
            color: '#374151',
            marginBottom: '2rem',
          }}
        >
          Review & Edit Parsed Data
        </h1>

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
                    <UploadTableView
                      key={tableIndex}
                      tableIndex={tableIndex}
                      handleRemoveTable={handleRemoveTable}
                      fileIndex={fileIndex}
                      handleTableCellChange={handleTableCellChange}
                      table={table}
                    />
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
      </div>
    </div>
  );
};

export default JsonEditorComponent;