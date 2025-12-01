import { useState, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Stack,
  Button,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';
import { useWalktour, Walktour } from 'src/components/walktour';
import { responsiveFontSizes } from 'src/theme/styles';

// ----------------------------------------------------------------------

const walktourSteps = [

  {
    target: '#event-name',
    title: 'הכנס את שם הסדר',
    content: 'לדוגמא: סדר א, סדר בוקר וכן הלאה',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '#event-start',
    title: 'הכנס את זמן התחלת הסדר',
    content: 'מתי מתחיל הסדר הראשון של היום?',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '#event-end',
    title: 'הכנס את זמן סיום הסדר',
    content: 'מתי מסתיים הסדר הראשון של היום?',
    placement: 'bottom',
    disableBeacon: true
  }, 
  {
    target: '#add-event',
    title: 'הוסף את הסדרים הנוספים בסדר יום',
    content: 'לאחר מכן תוכל לשנות את הזמנים ולעדכן אירועים מיוחדים',
    placement: 'bottom',
    disableBeacon: true
  },

];

//-----------------------------------------------------------------------
function useTamplatesStep() {

  const { control, watch } = useFormContext();

  const watchedTemplate = watch('templateData');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'templateData.events',
  });

  const [showWalktour, setShowWalktour] = useState(false);

  const handleAddEvent = () => {
    append({
      event_name: '',
      event_start: '',
      event_end: ''
    });
  };

  const handleRemoveEvent = (index) => {
    remove(index);
  };

  const handleStartTour = () => {
    setShowWalktour(true);
  };

  return {
    fields,
    handleRemoveEvent,
    handleAddEvent,
    watchedTemplate,
    showWalktour,
    setShowWalktour,
    handleStartTour
  }
}


export function TemplateDefinitionStep() {

  const {

    fields,
    handleRemoveEvent,
    handleAddEvent,
    watchedTemplate,
    showWalktour,
    setShowWalktour,
    handleStartTour

  } = useTamplatesStep()

  const walktourConfig = useWalktour({ 
    steps: walktourSteps, 
    defaultRun: true
  });

  useEffect(() => {
    if (showWalktour) {
      walktourConfig.setRun(true);
    }
  }, [showWalktour, walktourConfig]);

  return (
    <Box sx={{ p: { sm: 1.5, md: 2, lg: 2.5 } }}>
      <Stack spacing={{ sm: 1, md: 1.25, lg: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Tooltip title="הצג הדרכה">
            <IconButton 
              onClick={handleStartTour}
              color="primary"
              size="small"
            >
              <Iconify icon="mdi:help-circle" width={24} />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box>
          <Scrollbar sx={{ maxHeight: { sm: 300, md: 400, lg: 500 } }}>
            <Stack spacing={{ sm: 0.75, md: 1, lg: 1.25 }}>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    position: 'relative'
                  }}
                >
                  <IconButton
                    id='event-delete'
                    onClick={() => handleRemoveEvent(index)}
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Iconify icon="mdi:delete" width={16} />
                  </IconButton>

                  <Stack spacing={1}>
                    <Field.Text
                      name={`templateData.events[${index}].event_name`}
                      label="שם האירוע"
                      id='event-name'
                      placeholder="לדוגמה: שיעור ראשון"
                      variant="filled"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          ...responsiveFontSizes({ sm: 13, md: 14, lg: 14 })
                        }
                      }}
                    />

                    <Stack 
                      direction={{ sm: 'column', md: 'row' }} 
                      spacing={{ sm: 0.75, md: 1, lg: 1.25 }}
                    >
                      <Field.Text
                        id='event-start'
                        name={`templateData.events[${index}].event_start`}
                        label="זמן התחלה"
                        type="time"
                        variant="filled"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />

                      <Field.Text
                        id='event-end'
                        name={`templateData.events[${index}].event_end`}
                        label="זמן סיום"
                        type="time"
                        variant="filled"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Scrollbar>

          <Button
            type="button"
            variant="outlined"
            id='add-event'
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={handleAddEvent}
            sx={{ 
              mt: { sm: 1, md: 1.25, lg: 1.5 },
              fontSize: { sm: '0.813rem', md: '0.875rem', lg: '0.875rem' }
            }}
            fullWidth
          >
            הוסף אירוע חדש
          </Button>
        </Box>

        {watchedTemplate?.template_name && fields.length > 0 && (
          <Box sx={{ 
            p: { sm: 1, md: 1.25, lg: 1.5 }, 
            bgcolor: 'success.lighter', 
            borderRadius: 1 
          }}>
            <Typography 
              variant="body2" 
              color="success.dark"
              sx={responsiveFontSizes({ sm: 12, md: 13, lg: 14 })}
            >
              התבנית &quot;{watchedTemplate.template_name}&quot; מכילה {fields.length} אירועים
            </Typography>
          </Box>
        )}
      </Stack>
      <Walktour {...walktourConfig} />
    </Box>
  );
}