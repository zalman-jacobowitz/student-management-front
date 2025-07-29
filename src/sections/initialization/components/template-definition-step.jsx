import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  IconButton,
  Alert 
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function TemplateDefinitionStep() {
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

  return (
    <Box sx={{ p: 0 }}>
      <Stack spacing={3}>
        {/*
        <Field.Text
          name="templateData.template_name"
          label="שם התבנית"
          placeholder="לדוגמה: יום לימודים רגיל"
          variant="filled"
          fullWidth
        />
        */}
        

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
                      placeholder="לדוגמה: שיעור ראשון"
                      variant="filled"
                      fullWidth
                    />
                    
                    <Stack direction="row" spacing={2}>
                      <Field.Text
                        name={`templateData.events[${index}].event_start`}
                        label="זמן התחלה"
                        type="time"
                        variant="filled"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                      
                      <Field.Text
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
              התבנית "{watchedTemplate.template_name}" מכילה {fields.length} אירועים
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}