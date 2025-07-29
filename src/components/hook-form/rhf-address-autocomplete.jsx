import React, { useRef, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { loadGoogleMapsAPI } from 'src/utils/google-maps-loader';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Google Maps Autocomplete CSS styling to match Material-UI theme
const createGoogleMapsStyles = (theme) => `
  .pac-container {
    background-color: ${theme.vars.palette.background.paper};
    border-radius: ${theme.shape.borderRadius * 2}px;
    box-shadow: ${theme.customShadows.dropdown};
    border: none;
    margin-top: 4px;
    font-family: ${theme.typography.fontFamily};
    z-index: 9999;
  }

  .pac-item {
    border-top: none;
    padding: 12px 16px;
    font-size: ${theme.typography.body2.fontSize};
    line-height: ${theme.typography.body2.lineHeight};
    color: ${theme.vars.palette.text.primary};
    cursor: pointer;
    border-bottom: 1px solid ${theme.vars.palette.divider};
    transition: background-color 0.2s ease;
  }

  .pac-item:last-child {
    border-bottom: none;
  }

  .pac-item:hover,
  .pac-item-selected {
    background-color: ${theme.vars.palette.action.hover};
  }

  .pac-item-query {
    font-size: ${theme.typography.body2.fontSize};
    color: ${theme.vars.palette.text.primary};
    font-weight: ${theme.typography.fontWeightMedium};
  }

  .pac-matched {
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.vars.palette.primary.main};
  }

  .pac-icon {
    background-image: none;
    background-size: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    margin-right: 12px;
    margin-left: 0;
  }

  .pac-icon:before {
    content: "📍";
    font-size: 16px;
    line-height: 20px;
    color: ${theme.vars.palette.text.secondary};
  }

  .pac-icon-marker:before {
    content: "📍";
  }

  .pac-item-query .pac-matched {
    color: ${theme.vars.palette.primary.main};
  }

  .pac-logo:after {
    display: none;
  }
`;

export function RHFAddressAutocomplete({ 
  name, 
  label = 'כתובת', 
  placeholder = 'הכנס כתובת...', 
  helperText,
  variant,
  ...other 
}) {
  const { control, setValue } = useFormContext();
  const theme = useTheme();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const styleElementRef = useRef(null);
  const [isAPILoaded, setIsAPILoaded] = useState(false);

  useEffect(() => {
    let cleanup;
    
    loadGoogleMapsAPI()
      .then(() => {
        setIsAPILoaded(true);
        
        // Inject custom styles for Google Maps autocomplete
        if (!styleElementRef.current) {
          const styleElement = document.createElement('style');
          styleElement.textContent = createGoogleMapsStyles(theme);
          document.head.appendChild(styleElement);
          styleElementRef.current = styleElement;
        }
        
        if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'il' }, // הגבלה לישראל
            fields: ['formatted_address', 'geometry', 'name', 'address_components'],
            types: ['address'],
          });

          autocompleteRef.current = autocomplete;

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
              setValue(name, place.formatted_address, { shouldValidate: true });
            }
          });

          cleanup = () => {
            if (window.google && window.google.maps && window.google.maps.event) {
              window.google.maps.event.clearInstanceListeners(autocomplete);
            }
          };
        }
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
      });

    return () => {
      if (cleanup) cleanup();
      // Clean up styles when component unmounts
      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, [name, setValue, theme]);

  // Update styles when theme changes
  useEffect(() => {
    if (styleElementRef.current && isAPILoaded) {
      styleElementRef.current.textContent = createGoogleMapsStyles(theme);
    }
  }, [theme, isAPILoaded]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={inputRef}
          label={label}
          placeholder={placeholder}
          variant={variant}
          error={!!error}
          helperText={error ? error?.message : helperText}
          fullWidth
          InputProps={{
            startAdornment: (
              <Iconify 
                icon={isAPILoaded ? "mdi:map-marker" : "mdi:loading"} 
                sx={{ 
                  color: 'text.disabled', 
                  mr: 1,
                  ...(isAPILoaded ? {} : { 
                    animation: 'rotate 1s linear infinite',
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  })
                }} 
              />
            ),
            ...other.InputProps,
          }}
          inputProps={{
            autoComplete: 'address-line1',
            ...other.inputProps,
          }}
          {...other}
        />
      )}
    />
  );
}