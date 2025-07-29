// Button.jsx
import React from 'react';
import 'src/global.css';
import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


import { StudentsViewWrapper } from 'src/sections/students/view';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { ThemeProvider } from 'src/theme/theme-provider';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import App from 'src/app';
import { StudentsSimpleTable } from 'src/sections/students/students-simple-table';
import { info_columns, info_students } from 'src/actions/moks/mokes';

// אם אתה צריך גם את האותנטיקציה:
// import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';


const queryClient = new QueryClient();

function ForTest() {
  return useRoutes([
    { path: '*', element: <StudentsSimpleTable
        infoColumns={{newData: info_columns }}
        infoStudents={{data: info_students }}/>
     },
  ]);
}

export function ButtonStory() {
return (
  <StrictMode>
    <HelmetProvider>
  <BrowserRouter>
  <Suspense>
  <QueryClientProvider client={queryClient}>
  <SettingsProvider settings={defaultSettings}>
    <ThemeProvider>
    <MotionLazy>
          <Snackbar />
          <ProgressBar />
          <SettingsDrawer />
            <ForTest />
          </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </Suspense>
  </BrowserRouter>
  </HelmetProvider>
  </StrictMode>
)
}