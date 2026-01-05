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
  overview:       { titleKey: 'screens.overview', path: paths.dashboard.overview, icon: ICONS.dashboard, regularIcon: 'material-symbols:dashboard' },
  insert:         { titleKey: 'screens.insert',     path: paths.dashboard.insert,             icon: ICONS.calendar, regularIcon: 'material-symbols:edit-document' },
  profile:        { titleKey: 'screens.profile', path: paths.dashboard.profile(undefined),     icon: ICONS.user, regularIcon: 'material-symbols:person' },
  info:           { titleKey: 'screens.info', path: paths.dashboard.list, icon: ICONS.user, regularIcon: 'material-symbols:group' },
  // infocolumns:    { titleKey: 'screens.infocolumns',  path: paths.dashboard.infoColumns, icon: ICONS.parameter, regularIcon: 'material-symbols:view-column' },
  users:          { titleKey: 'screens.users',   path: paths.dashboard.users,  icon: ICONS.user, regularIcon: 'material-symbols:group' },
  // userPermissions:{ titleKey: 'screens.userPermissions', path: paths.dashboard.users,  icon: ICONS.lock, regularIcon: 'material-symbols:admin-panel-settings' },
  // export:         { titleKey: 'screens.export', path: paths.dashboard.export, icon: ICONS.export, regularIcon: 'material-symbols:file-export' },
  templates:      { titleKey: 'screens.templates', path: paths.dashboard.templates, icon: ICONS.file, regularIcon: 'material-symbols:description' },
  days:           { titleKey: 'screens.days', path: paths.dashboard.days, icon: ICONS.calendar, regularIcon: 'material-symbols:calendar-today' },
  // initialization: { titleKey: 'screens.initialization', path: paths.dashboard.initialization, icon: ICONS.parameter, regularIcon: 'material-symbols:settings' },
  exceptions:    { titleKey: 'screens.exceptions', path: paths.dashboard.exceptions, icon: ICONS.lock, regularIcon: 'material-symbols:verified' },
  details: { titleKey: 'screens.details', path: paths.dashboard.details, icon: ICONS.analytics, regularIcon: 'material-symbols:details' },
  scan: { titleKey: 'screens.scan', path: paths.dashboard.uploadScanDocs, icon: ICONS.file, regularIcon: 'material-symbols:settings' },
  download: { titleKey: 'screens.download', path: paths.dashboard.download, icon: ICONS.mail, regularIcon: 'material-symbols:download' },
  summary: { titleKey: 'screens.summary', path: paths.dashboard.summary, icon: ICONS.analytics, regularIcon: 'material-symbols:summary' },
  tests: { titleKey: 'screens.tests', path: paths.dashboard.tests, icon: ICONS.analytics, regularIcon: 'material-symbols:summary' },
  

}

export const navData = [];