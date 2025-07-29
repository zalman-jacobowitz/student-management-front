import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// בפועל אין קבצים בתיקיית src/pages/components/ ותת-תיקיותיה

// ----------------------------------------------------------------------

export const componentsRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </Suspense>
    ),
    children: [
      {
        path: 'components',
        children: [
          // אין דפים קיימים
        ],
      },
    ],
  },
];
