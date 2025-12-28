import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  settings: icon('ic-settings'),
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  export: icon('ic-export'),
  docs: icon('ic-docs'),
};


export const screenOptions = {
  overview:       { title: 'סקירה כללית', path: paths.dashboard.overview, icon: ICONS.dashboard, regularIcon: 'material-symbols:dashboard' },
  insert:         { title: 'נתוני נוכחות',     path: paths.dashboard.insert,             icon: ICONS.calendar, regularIcon: 'material-symbols:edit-document' },
  profile:        { title: 'פרופיל אישי', path: paths.dashboard.profile(undefined),     icon: ICONS.user, regularIcon: 'material-symbols:person' },
  info:           { title: 'רשימת תלמידים', path: paths.dashboard.list, icon: ICONS.user, regularIcon: 'material-symbols:group' },
  // infocolumns:    { title: 'רשימת עמודות',  path: paths.dashboard.infoColumns, icon: ICONS.parameter, regularIcon: 'material-symbols:view-column' },
  users:          { title: 'משתמשים',   path: paths.dashboard.users,  icon: ICONS.user, regularIcon: 'material-symbols:group' },
  // userPermissions:{ title: 'הגדרת משתמש', path: paths.dashboard.users,  icon: ICONS.lock, regularIcon: 'material-symbols:admin-panel-settings' },
  // export:         { title: 'ייצוא', path: paths.dashboard.export, icon: ICONS.export, regularIcon: 'material-symbols:file-export' },
  templates:      { title: 'תבניות', path: paths.dashboard.templates, icon: ICONS.file, regularIcon: 'material-symbols:description' },
  days:           { title: 'ימים', path: paths.dashboard.days, icon: ICONS.calendar, regularIcon: 'material-symbols:calendar-today' },
  // initialization: { title: 'איתחול המערכת', path: paths.dashboard.initialization, icon: ICONS.parameter, regularIcon: 'material-symbols:settings' },
  exceptions:    { title: 'אישורים', path: paths.dashboard.exceptions, icon: ICONS.lock, regularIcon: 'material-symbols:verified' },
  details: { title: 'רישומים', path: paths.dashboard.details, icon: ICONS.analytics, regularIcon: 'material-symbols:details' },
  scan: { title: 'סריקת דפים', path: paths.dashboard.uploadScanDocs, icon: ICONS.file, regularIcon: 'material-symbols:settings' },
  download: { title: 'הורדת תבנית', path: paths.dashboard.download, icon: ICONS.mail, regularIcon: 'material-symbols:download' },
  summary: { title: 'סיכום נוכחות', path: paths.dashboard.summary, icon: ICONS.analytics, regularIcon: 'material-symbols:summary' },
  tests: { title: 'מבחנים', path: paths.dashboard.tests, icon: ICONS.analytics, regularIcon: 'material-symbols:summary' },
  

}

export const navData = [];
