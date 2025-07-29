import { Box, Typography, Stack, Alert, Chip, Divider } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Iconify } from 'src/components/iconify';
import useInitializationStore from '../initialization-state';

// ----------------------------------------------------------------------

export function CompletionStep() {
  const { watch } = useFormContext();
  const formData = watch();
  const { studentsData, formattedColumns } = useInitializationStore();

  const getStepStatus = () => {
    const steps = [
      {
        name: 'העלאת קבצים',
        completed: !!formData?.studentFile?.file,
        icon: 'mdi:file-upload',
        details: formData?.studentFile?.file ? formData.studentFile.file.name : 'לא הועלה קובץ'
      },
      {
        name: 'הגדרת תבניות',
        completed: !!formData?.templateData?.template_name,
        icon: 'mdi:clock-outline',
        details: formData?.templateData?.template_name || 'לא הוגדרה תבנית'
      },
      {
        name: 'הגדרת עמודות',
        completed: !!(formattedColumns && formattedColumns.length > 0),
        icon: 'mdi:table-column',
        details: formattedColumns ? `${formattedColumns.length} עמודות הוגדרו` : 'לא הוגדרו עמודות'
      }
    ];

    return steps;
  };

  const steps = getStepStatus();
  const allCompleted = steps.every(step => step.completed);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        סיכום איתחול המערכת
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        סקירה של השלבים שהושלמו במהלך איתחול המערכת.
      </Typography>

      {allCompleted ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            🎉 כל השלבים הושלמו בהצלחה! המערכת מוכנה לשימוש.
          </Typography>
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            יש עדיין שלבים שלא הושלמו. ודא שכל השלבים הדרושים בוצעו.
          </Typography>
        </Alert>
      )}

      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Box
            key={step.name}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: step.completed ? 'success.main' : 'warning.main',
              borderRadius: 1,
              bgcolor: step.completed ? 'success.lighter' : 'warning.lighter'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Iconify 
                icon={step.icon} 
                sx={{ 
                  color: step.completed ? 'success.main' : 'warning.main',
                  width: 24,
                  height: 24
                }} 
              />
              
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">
                    {step.name}
                  </Typography>
                  <Chip 
                    label={step.completed ? 'הושלם' : 'לא הושלם'}
                    size="small"
                    color={step.completed ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {step.details}
                </Typography>
              </Box>
              
              <Iconify 
                icon={step.completed ? 'mdi:check-circle' : 'mdi:alert-circle'}
                sx={{ 
                  color: step.completed ? 'success.main' : 'warning.main',
                  width: 20,
                  height: 20
                }} 
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* פרטי התבנית */}
      {formData?.templateData?.events && formData.templateData.events.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            פרטי התבנית:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            שם התבנית: {formData.templateData.template_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            מספר אירועים: {formData.templateData.events.length}
          </Typography>
        </Box>
      )}

      {/* פרטי נתוני התלמידים */}
      {studentsData && studentsData.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            נתוני התלמידים:
          </Typography>
          <Typography variant="body2" color="success.dark">
            נטענו {studentsData.length} תלמידים מהקובץ
          </Typography>
          {formData?.studentFile?.file && (
            <Typography variant="body2" color="text.secondary">
              מקור: {formData.studentFile.file.name}
            </Typography>
          )}
        </Box>
      )}

      {/* פרטי העמודות */}
      {formattedColumns && formattedColumns.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            פרטי העמודות ({formattedColumns.length}):
          </Typography>
          
          <Stack spacing={1} sx={{ maxHeight: 200, overflow: 'auto' }}>
            {formattedColumns.map((column, index) => (
              <Box key={column.name} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1,
                bgcolor: 'background.paper',
                borderRadius: 0.5
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 120 }}>
                  {column.label || column.name}
                </Typography>
                
                <Stack direction="row" spacing={0.5}>
                  <Chip 
                    size="small" 
                    label={column.type} 
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                  
                  {column.hidden && (
                    <Chip 
                      size="small" 
                      label="מוסתר" 
                      color="error"
                      variant="soft"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  )}
                  
                  {column.required && (
                    <Chip 
                      size="small" 
                      label="חובה" 
                      color="warning"
                      variant="soft"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  )}
                  
                  {column.filters === 'extra' && (
                    <Chip 
                      size="small" 
                      label="פילטר נגיש" 
                      color="info"
                      variant="soft"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  )}
                  
                  {column.group_name && (
                    <Chip 
                      size="small" 
                      label={column.group_name} 
                      color="secondary"
                      variant="soft"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          לאחר השלמת האיתחול, תועבר לדף הראשי של המערכת לניהול התלמידים.
        </Typography>
      </Alert>
    </Box>
  );
}