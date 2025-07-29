

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  staticDirs: ['../public'],
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    // הגדרת environment variables עבור Storybook
    config.define = {
      ...config.define,
      'import.meta.env.VITE_SERVER_URL': JSON.stringify('http://localhost:8080'),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('mock-supabase-url'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('mock-supabase-key'),
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(''),
      'import.meta.env.VITE_ASSETS_DIR': JSON.stringify(''),
    };
    return config;
  }
};
export default config;
