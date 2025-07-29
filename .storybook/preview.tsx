import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '../src/locales/i18n-provider';
import { LocalizationProvider } from '../src/locales';
import { ThemeProvider } from '../src/theme/theme-provider';
import { SettingsProvider, defaultSettings } from '../src/components/settings';
import { MotionLazy } from '../src/components/animate/motion-lazy';
import { Snackbar } from '../src/components/snackbar';
import '../src/global.css';

// רישום MSW (אפשר לקנפג onUnhandledRequest וכו')
initialize({ onUnhandledRequest: 'bypass' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrapper עם כל הקונטקסט הדרוש
const StorybookWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>
    <LocalizationProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider settings={defaultSettings}>
          <ThemeProvider>
            <MotionLazy>
              <Snackbar />
              {children}
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  </I18nProvider>
);

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
};

export default preview;