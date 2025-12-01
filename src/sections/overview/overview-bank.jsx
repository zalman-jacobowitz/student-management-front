import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';

import { Box, Typography, Button, Link, Container, Stack } from '@mui/material';

import { readFile } from 'src/utils/files/read-file';
import { downloadTemplateExcel, downloadTemplateCSV } from 'src/utils/files/download-tamplate';

import { Upload } from 'src/components/upload';
import { TemplatesViewer } from './templates-viewer';

import { useBoolean } from 'src/hooks/use-boolean.js';
import { useCallback, useEffect, useState } from 'react';
import { useWalktour } from 'src/components/walktour/use-walktour.jsx';
import { Walktour } from 'src/components/walktour/walktour.jsx';


// groupBy function moved to templates-viewer.jsx
// ----------------------------------------------------------------------

  const walktourSteps = [
      {
          target: '#download-template',
        title: 'לחץ על אחד הכפתורים להורדה של דוגמא לקובץ פרטי תלמידים',
        content: 'בחר כאן את העמודה המכילה את השמות הפרטיים של התלמידים. זה יעזור למערכת לזהות נכון כל תלמיד.',
        placement: 'bottom',
        disableBeacon: true
      },
    {
        target: '#upload-file',
        title: 'אם יש לך קובץ מוכן גרור אותו לכאן',
        content: 'בחר כאן את העמודה המכילה את השמות הפרטיים של התלמידים. זה יעזור למערכת לזהות נכון כל תלמיד.',
        placement: 'bottom',
        disableBeacon: true
    }
      
    ];

// ------------------------------------------------------------
function useStudentFileUpload(){

  // פונקציה מקומית לקריאת קובץ CSV
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return { columns: [], data: [] };
    
    // חילוץ כותרות העמודות
    const headers = lines[0].split(',').map(h => h.trim());
    
    // המרת שורות לאובייקטים
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return {
      columns: headers,
      data: rows
    };
  };

  // מייבא את הפונקציה לאיחול הנתונים שהועולו
  const [watchedFile, setWatchedFile] = useState(null);
  
  // פונקציית העלאת המסמך
  const handleFileUpload = (acceptedFiles) => {
    const fileDetails = acceptedFiles[0];
    if (!fileDetails) return;

    
    
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileDetails);
    
    reader.onload = (event) => {
      
      const result = readFile({
        fileDetils: fileDetails,
        types: ['excel', 'csv'],
        fileData: event.target.result
      });
      console.log({result});
      if (result.status === 'success') {
        const { columns, data } = result.data;
        
        setWatchedFile(data)
        
        toast.success(`נטענו ${data.length} תלמידים עם ${columns.length} עמודות`);
      } else {
        toast.error('שגיאה בקריאת הקובץ');
      }

    };

    reader.onerror = () => {
      toast.error('שגיאה בקריאת הקובץ');
    };
  };

  const handleRemoveFile = () => {
    123
  };

  const handleDownloadTemplate = (format) => {
    if (format === 'excel') {
      downloadTemplateExcel();
    } else if (format === 'csv') {
      downloadTemplateCSV();
    }
  };

  return {
    handleDownloadTemplate,
    watchedFile,
    handleRemoveFile,
    handleFileUpload
  }
}


export function FileUploadStep() {
  
  const {
  
    handleDownloadTemplate,
    watchedFile,
    handleRemoveFile,
    handleFileUpload,
    
  } = useStudentFileUpload()

  
  
  
  const renderTemplatesDownload = (
    <Container maxWidth="sm">
      <Box id='download-template'>
        <Typography variant="subtitle2">
          הורד תבנית קובץ:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDownloadTemplate('excel')}
          >
            הורד תבנית Excel
          </Button>
          <Button
            variant="outlined" 
            size="small"
            onClick={() => handleDownloadTemplate('csv')}
          >
            הורד תבנית CSV
          </Button>
        </Stack>
      </Box>
    </Container>
  );
  const viewer = useBoolean();

  useEffect(() => {
    if (watchedFile) {
      viewer.onTrue();
    }
  }, [watchedFile]);


  const renderUpload = (
    <Container maxWidth="sm">
      <Box>
        <Upload
          multiple={false}
          files={watchedFile ? [watchedFile] : []}
          onDrop={handleFileUpload}
          onRemove={handleRemoveFile}
          accept={{
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
          }}
          maxSize={5000000}
          placeholder={
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6">
                גרור את הקובץ לכאן או
              </Typography>
              <Link 
                variant="body1" 
                underline="hover" 
                sx={{ cursor: 'pointer' }}
              >
                בחר קובץ מהמחשב
              </Link>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                נתמכים: Excel (.xlsx, .xls) ו-CSV (עד 5MB)
              </Typography>
            </Box>
          }
        />
      </Box>
    </Container>
  );


  const renderTemplatesViewer = (
    <TemplatesViewer watchedFile={watchedFile} />
  );

  return (
    <Box sx={{ p: 2 }}>
      { !watchedFile && renderTemplatesDownload}
      { !watchedFile && renderUpload }
      { watchedFile && renderTemplatesViewer }
      
      <Walktour {...useWalktour({steps: walktourSteps, defaultRun: false})} />
    </Box>
  );
}