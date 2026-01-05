import { Box, Typography, Stack, Alert, Chip, Divider } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Iconify } from 'src/components/iconify';
import { responsiveFontSizes } from 'src/theme/styles';
import useInitializationStore from '../initialization-state.ts';

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
    <Box sx={{ p: { sm: 1.5, md: 2, lg: 2.5 } }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: { sm: 0.75, md: 1, lg: 1.25 },
          ...responsiveFontSizes({ sm: 18, md: 20, lg: 22 })
        }}
      >
        סיכום איתחול המערכת
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: { sm: 1, md: 1.25, lg: 1.5 },
          ...responsiveFontSizes({ sm: 12, md: 13, lg: 13 })
        }}
      >
        סקירה של השלבים שהושלמו במהלך איתחול המערכת.
      </Typography>

      {allCompleted ? (
        <Alert severity="success" sx={{ mb: { sm: 1, md: 1.25, lg: 1.5 } }}>
          <Typography 
            variant="body2"
            sx={responsiveFontSizes({ sm: 12, md: 13, lg: 13 })}
          >
            🎉 כל השלבים הושלמו בהצלחה! המערכת מוכנה לשימוש.
          </Typography>
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: { sm: 1, md: 1.25, lg: 1.5 } }}>
          <Typography 
            variant="body2"
            sx={responsiveFontSizes({ sm: 12, md: 13, lg: 13 })}
          >
            יש עדיין שלבים שלא הושלמו. ודא שכל השלבים הדרושים בוצעו.
          </Typography>
        </Alert>
      )}

      <Stack spacing={{ sm: 0.75, md: 1, lg: 1.25 }}>
        {steps.map((step, index) => (
          <Box
            key={step.name}
            sx={{
              p: { sm: 1, md: 1.25, lg: 1.5 },
              border: '1px solid',
              borderColor: step.completed ? 'success.main' : 'warning.main',
              borderRadius: 1,
              bgcolor: step.completed ? 'success.lighter' : 'warning.lighter'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={{ sm: 0.75, md: 1, lg: 1.25 }}>
              <Iconify 
                icon={step.icon} 
                sx={{ 
                  color: step.completed ? 'success.main' : 'warning.main',
                  width: { sm: 20, md: 24, lg: 24 },
                  height: { sm: 20, md: 24, lg: 24 }
                }} 
              />
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack 
                  direction={{ sm: 'column', md: 'row' }} 
                  alignItems={{ sm: 'flex-start', md: 'center' }}
                  spacing={{ sm: 0.25, md: 0.75, lg: 0.75 }}
                >
                  <Typography 
                    variant="subtitle2"
                    sx={responsiveFontSizes({ sm: 13, md: 14, lg: 14 })}
                  >
                    {step.name}
                  </Typography>
                  <Chip 
                    label={step.completed ? 'הושלם' : 'לא הושלם'}
                    size="small"
                    color={step.completed ? 'success' : 'warning'}
                    variant="outlined"
                    sx={{
                      fontSize: { sm: '0.65rem', md: '0.75rem', lg: '0.75rem' },
                      height: { sm: 20, md: 24, lg: 24 }
                    }}
                  />
                </Stack>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={responsiveFontSizes({ sm: 11, md: 12, lg: 12 })}
                >
                  {step.details}
                </Typography>
              </Box>
              
              <Iconify 
                icon={step.completed ? 'mdi:check-circle' : 'mdi:alert-circle'}
                sx={{ 
                  color: step.completed ? 'success.main' : 'warning.main',
                  width: { sm: 18, md: 20, lg: 20 },
                  height: { sm: 18, md: 20, lg: 20 },
                  flexShrink: 0
                }} 
              />
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* פרטי התבנית */}
      {formData?.templateData?.events && formData.templateData.events.length > 0 && (
        <Box sx={{ 
          mt: { sm: 1, md: 1.25, lg: 1.5 }, 
          p: { sm: 1, md: 1.25, lg: 1.5 }, 
          bgcolor: 'info.lighter', 
          borderRadius: 1 
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: { sm: 0.5, md: 0.75, lg: 0.75 },
              ...responsiveFontSizes({ sm: 13, md: 14, lg: 14 })
            }}
          >
            פרטי התבנית:
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={responsiveFontSizes({ sm: 11, md: 12, lg: 12 })}
          >
            שם התבנית: {formData.templateData.template_name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={responsiveFontSizes({ sm: 11, md: 12, lg: 12 })}
          >
            מספר אירועים: {formData.templateData.events.length}
          </Typography>
        </Box>
      )}

      {/* פרטי נתוני התלמידים */}
      {studentsData && studentsData.length > 0 && (
        <Box sx={{ 
          mt: { sm: 1, md: 1.25, lg: 1.5 }, 
          p: { sm: 1, md: 1.25, lg: 1.5 }, 
          bgcolor: 'success.lighter', 
          borderRadius: 1 
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: { sm: 0.5, md: 0.75, lg: 0.75 },
              ...responsiveFontSizes({ sm: 13, md: 14, lg: 14 })
            }}
          >
            נתוני התלמידים:
          </Typography>
          <Typography 
            variant="body2" 
            color="success.dark"
            sx={responsiveFontSizes({ sm: 11, md: 12, lg: 12 })}
          >
            נטענו {studentsData.length} תלמידים מהקובץ
          </Typography>
          {formData?.studentFile?.file && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={responsiveFontSizes({ sm: 11, md: 12, lg: 12 })}
            >
              מקור: {formData.studentFile.file.name}
            </Typography>
          )}
        </Box>
      )}

      {/* פרטי העמודות */}
      {formattedColumns && formattedColumns.length > 0 && (
        <Box sx={{ 
          mt: { sm: 1, md: 1.25, lg: 1.5 }, 
          p: { sm: 1, md: 1.25, lg: 1.5 }, 
          bgcolor: 'primary.lighter', 
          borderRadius: 1 
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: { sm: 0.75, md: 1, lg: 1 },
              ...responsiveFontSizes({ sm: 13, md: 14, lg: 14 })
            }}
          >
            פרטי העמודות ({formattedColumns.length}):
          </Typography>
          
          <Stack spacing={{ sm: 0.5, md: 0.75, lg: 0.75 }} sx={{ maxHeight: 200, overflow: 'auto' }}>
            {formattedColumns.map((column, index) => (
              <Box key={column.name} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { sm: 0.25, md: 0.75, lg: 0.75 },
                p: { sm: 0.5, md: 0.75, lg: 0.75 },
                bgcolor: 'background.paper',
                borderRadius: 0.5,
                flexWrap: 'wrap'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'medium', 
                    minWidth: { sm: 100, md: 120, lg: 120 },
                    ...responsiveFontSizes({ sm: 11, md: 12, lg: 12 })
                  }}
                >
                  {column.label || column.name}
                </Typography>
                
                <Stack direction="row" spacing={{ sm: 0.2, md: 0.35, lg: 0.5 }}>
                  <Chip 
                    size="small" 
                    label={column.type} 
                    variant="outlined"
                    sx={{ 
                      fontSize: { sm: '0.6rem', md: '0.65rem', lg: '0.65rem' }, 
                      height: { sm: 16, md: 18, lg: 18 } 
                    }}
                  />
                  
                  {column.hidden && (
                    <Chip 
                      size="small" 
                      label="מוסתר" 
                      color="error"
                      variant="soft"
                      sx={{ 
                        fontSize: { sm: '0.6rem', md: '0.65rem', lg: '0.65rem' }, 
                        height: { sm: 16, md: 18, lg: 18 } 
                      }}
                    />
                  )}
                  
                  {column.required && (
                    <Chip 
                      size="small" 
                      label="חובה" 
                      color="warning"
                      variant="soft"
                      sx={{ 
                        fontSize: { sm: '0.6rem', md: '0.65rem', lg: '0.65rem' }, 
                        height: { sm: 16, md: 18, lg: 18 } 
                      }}
                    />
                  )}
                  
                  {column.filters === 'extra' && (
                    <Chip 
                      size="small" 
                      label="פילטר נגיש" 
                      color="info"
                      variant="soft"
                      sx={{ 
                        fontSize: { sm: '0.6rem', md: '0.65rem', lg: '0.65rem' }, 
                        height: { sm: 16, md: 18, lg: 18 } 
                      }}
                    />
                  )}
                  
                  {column.group_name && (
                    <Chip 
                      size="small" 
                      label={column.group_name} 
                      color="secondary"
                      variant="soft"
                      sx={{ 
                        fontSize: { sm: '0.6rem', md: '0.65rem', lg: '0.65rem' }, 
                        height: { sm: 16, md: 18, lg: 18 } 
                      }}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Alert 
        severity="info" 
        sx={{ mt: { sm: 1, md: 1.25, lg: 1.5 } }}
      >
        <Typography 
          variant="body2"
          sx={responsiveFontSizes({ sm: 12, md: 13, lg: 13 })}
        >
          לאחר השלמת האיתחול, תועבר לדף הראשי של המערכת לניהול התלמידים.
        </Typography>
      </Alert>
    </Box>
  );
}