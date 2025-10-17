import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Stack,
  Button,
  Typography,
  IconButton
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';
import { useWalktour, Walktour } from 'src/components/walktour';

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

  return {
    fields,
    handleRemoveEvent,
    handleAddEvent,
    watchedTemplate
  }
}


export function TemplateDefinitionStep() {

  const {

    fields,
    handleRemoveEvent,
    handleAddEvent,
    watchedTemplate

  } = useTamplatesStep()

  return (
    <Box sx={{ p: 0 }}>
      <Stack spacing={3}>
        <Box>
          <Scrollbar sx={{ maxHeight: 400 }}>
            <Stack spacing={2}>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
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

                  <Stack spacing={2}>
                    <Field.Text
                      name={`templateData.events[${index}].event_name`}
                      label="שם האירוע"
                      id='event-name'
                      placeholder="לדוגמה: שיעור ראשון"
                      variant="filled"
                      fullWidth
                    />

                    <Stack direction="row" spacing={2}>
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
            sx={{ mt: 2 }}
            fullWidth
          >
            הוסף אירוע חדש
          </Button>
        </Box>

        {watchedTemplate?.template_name && fields.length > 0 && (
          <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="success.dark">
              התבנית &quot;{watchedTemplate.template_name}&quot; מכילה {fields.length} אירועים
            </Typography>
          </Box>
        )}
      </Stack>
      <Walktour {...useWalktour({ steps: walktourSteps })} />
    </Box>
  );
}