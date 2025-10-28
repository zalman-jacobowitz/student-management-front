
const MOCK_ID = '5f8d7b2c-3e4f-4a1b-9c2d-6e7f8a9b0c1d';

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/ניהול',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  payment: '/payment',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  // AUTH
  auth: {
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root:`${ROOTS.DASHBOARD}/סקירה`,
    initialization: `${ROOTS.DASHBOARD}/איתחול`,
    insert: `${ROOTS.DASHBOARD}/הכנסת-נתונים`,
    users: `${ROOTS.DASHBOARD}/הרשאות-משתמשים`,
    infoColumns: `${ROOTS.DASHBOARD}/הגדרת-עמודות`,
    profile: (id) => !id ? `${ROOTS.DASHBOARD}/פרופיל-אישי` : `${ROOTS.DASHBOARD}/${id}/פרופיל-אישי`,
    export: `${ROOTS.DASHBOARD}/ייצוא`,
    templates: `${ROOTS.DASHBOARD}/תבניות`,
    days: `${ROOTS.DASHBOARD}/ימים`,
    exceptions: `${ROOTS.DASHBOARD}/אישורים`,
    summary: `${ROOTS.DASHBOARD}/סיכום`,
    uploadScanDocs: `${ROOTS.DASHBOARD}/העלאת-דוחות-רישום`,
    download: `${ROOTS.DASHBOARD}/הורדת-תבנית`,
    details: `${ROOTS.DASHBOARD}/רישומים`,
    tests: `${ROOTS.DASHBOARD}/מבחנים`,
    overview: `${ROOTS.DASHBOARD}/סקירה`,
    list: `${ROOTS.DASHBOARD}/רשימה`,

  },
};

export const PATH_AFTER_LOGIN = paths.dashboard.root;