import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { SimpleLayout } from 'src/layouts/simple';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------


// Students
const StudentsListPage = lazy(() => import('src/pages/dashboard/students'));
// initialization
const InitializationPage = lazy(() => import('src/pages/dashboard/initialization'));
// insert
const InsertPage = lazy(() => import('src/pages/dashboard/insert'));
// profile
const ProfilePage = lazy(() => import('src/pages/dashboard/profile'));
// Initialize System
const ColumnsListPage = lazy(() => import('src/pages/dashboard/columns'));
// Users
const UsersPage = lazy(() => import('src/pages/dashboard/user'));
// export
const ExportPage = lazy(() => import('src/pages/dashboard/export'));
// templates
const TemplatesPage = lazy(() => import('src/pages/dashboard/templates'));
// days
const DaysPage = lazy(() => import('src/pages/dashboard/days'));
// exceptions
const ExceptionsPage = lazy(() => import('src/pages/dashboard/exceptions'));
// summary
const SummaryPage = lazy(() => import('src/pages/dashboard/summary'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const simpleLayoutContent = (
  <SimpleLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </SimpleLayout>
);

export const dashboardRoutes = [
  {
    path: 'ניהול',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <StudentsListPage />, index: true },
      { path: 'הכנסת-נתונים', element: <InsertPage /> },
      { path: 'הרשאות-משתמשים', element: <UsersPage /> },
      { path: 'רשימה', element: <StudentsListPage /> },
      { path: 'פרופיל-אישי', element: <ProfilePage /> },
      { path: 'הגדרת-עמודות', element: <ColumnsListPage /> },
      { path: 'ייצוא', element: <ExportPage /> },
      { path: 'תבניות', element: <TemplatesPage /> },
      { path: 'ימים', element: <DaysPage /> },
      { path: 'אישורים', element: <ExceptionsPage /> },
      { path: 'סיכום', element: <SummaryPage /> },
    ],
  },
  {
    path: 'ניהול/איתחול',
    element: CONFIG.auth.skip ? <>{simpleLayoutContent}</> : <AuthGuard>{simpleLayoutContent}</AuthGuard>,
    children: [
      { element: <InitializationPage />, index: true },
    ],
  },
];
