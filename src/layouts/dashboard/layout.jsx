import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { useUserDetails } from 'src/hooks/use-user-details';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../config-nav-account';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { StyledDivider, useNavColorVars } from './styles';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { HelpButton } from 'src/components/walktour';

import { useAuthContext } from 'src/auth/hooks';

import { screenOptions, navData as dashboardNavData } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

/*
const groups = {
  'ניהול נתונים': ['info', 'users'],
  'ניהול נוכחות': ['manager', 'export', 'scan', 'download','exceptions'],
  'ניהול זמנים': ['templates', 'days'],
  'מבחנים': ['tests'],
  'סיכומים': ['profile', 'insert', 'summary', 'details', 'overview'],
  'הגדרות': ['settings', 'inialize', 'userPermissions', 'initialization'],
};
*/
const groups = {
  'ניהול נוכחות': ['overview', 'insert', 'exceptions', 'users'],
  'ניהול נתונים': ['info', 'profile', 'scan'],
  'ניהול זמנים': ['templates', 'days'],
};
function screensFormat(data, isAdmin = false) {
  // If user is admin, show all available screens
  if (isAdmin) {
    const listScreens = Object.keys(screenOptions);
    const screens = [];

    Object.keys(groups).forEach((group) => {
      const g_scrns = listScreens
        .filter((screen) => groups[group].includes(screen))
        .map((screen) => screenOptions[screen]);
      const scrn = {
        subheader: group,
        items: g_scrns,
      };
      if (g_scrns.length > 0) {
        screens.push(scrn);
      }
    });

    return screens;
  }

  // Regular users see only their permitted screens
  const listScreens =  Object.keys(data.user_metadata.screens).filter(screen => data.user_metadata.screens[screen])
  // const listScreens = Object.keys(screenOptions).map(screen => screen) // Object.keys(data.user_metadata.screens).filter(screen => data.user_metadata.screens[screen])

  const screens = []

  Object.keys(groups).forEach((group) => {
    const g_scrns = listScreens
      .filter((screen) => groups[group].includes(screen))
      .map((screen) => screenOptions[screen]);
    const scrn = {
      subheader: group,
      items: g_scrns,
    };
    if (g_scrns.length > 0) {
      screens.push(scrn);
    }
  });

  return screens;
}

export function DashboardLayout({ sx, children, header, data }) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery = 'lg';

  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  const userDetails = useUserDetails();
  const navData = userDetails.userDetails
    ? screensFormat(userDetails.userDetails, isAdmin)
    : (data?.nav ?? dashboardNavData);
  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          disableElevation={isNavVertical}
          slotProps={{
            toolbar: {
              sx: {
                ...(isNavHorizontal && {
                  bgcolor: 'var(--layout-nav-bg)',
                  [`& .${iconButtonClasses.root}`]: {
                    color: 'var(--layout-nav-text-secondary-color)',
                  },
                  [theme.breakpoints.up(layoutQuery)]: {
                    height: 'var(--layout-nav-horizontal-height)',
                  },
                }),
              },
            },
            container: {
              maxWidth: false,
              sx: {
                ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
              },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            bottomArea: isNavHorizontal ? (
              <NavHorizontal
                data={navData}
                layoutQuery={layoutQuery}
                cssVars={navColorVars.section}
              />
            ) : null,
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                  cssVars={navColorVars.section}
                />
                {/* -- Logo -- */}
                {isNavHorizontal && (
                  <Logo
                    sx={{
                      display: 'none',
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: 'inline-flex',
                      },
                    }}
                  />
                )}
                {/* -- Divider -- */}
                {isNavHorizontal && (
                  <StyledDivider
                    sx={{
                      [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
                    }}
                  />
                )}
                {/* -- Workspace popover --
                <WorkspacesPopover
                  data={_workspaces}
                  sx={{ color: 'var(--layout-nav-text-primary-color)' }}
                />
                 */}
              </>
            ),
            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 0, sm: 0.75 }}>
                {/* -- Searchbar -- */}
                <Searchbar data={navData} />

                {/* -- Help button -- */}
                <HelpButton />
                {/* -- Language popover -- 
                <LanguagePopover data={allLangs} />
                {/* -- Notifications popover -- 
                <NotificationsDrawer data={_notifications} />
                {/* -- Contacts popover -- 
                <ContactsPopover data={_contacts} />
                */}
                {/* -- Settings button -- */}
                <SettingsButton />
                {/* -- Account drawer -- */}
                <AccountDrawer data={_account} />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        isNavHorizontal ? null : (
          <NavVertical
            data={navData}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navColorVars.section}
            onToggleNav={() =>
              settings.onUpdateField(
                'navLayout',
                settings.navLayout === 'vertical' ? 'mini' : 'vertical'
              )
            }
          />
        )
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        ...navColorVars.layout,
        '--layout-transition-easing': 'linear',
        '--layout-transition-duration': '120ms',
        '--layout-nav-mini-width': '88px',
        '--layout-nav-vertical-width': '300px',
        '--layout-nav-horizontal-height': '64px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            transition: theme.transitions.create(['padding-left'], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
