// vite.config.js
import path from "path";
import checker from "file:///mnt/c/Users/shneor%20rabinovitch/Documents/code/student-managmant/frontend/node_modules/vite-plugin-checker/dist/esm/main.js";
import { defineConfig } from "file:///mnt/c/Users/shneor%20rabinovitch/Documents/code/student-managmant/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/shneor%20rabinovitch/Documents/code/student-managmant/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///mnt/c/Users/shneor%20rabinovitch/Documents/code/student-managmant/frontend/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.mjs";
var __vite_injected_original_dirname = "/mnt/c/Users/shneor rabinovitch/Documents/code/student-managmant/frontend";
var __vite_injected_original_import_meta_url = "file:///mnt/c/Users/shneor%20rabinovitch/Documents/code/student-managmant/frontend/vite.config.js";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var PORT = 3030;
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: {
          logLevel: ["error"]
        }
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  server: {
    port: PORT,
    host: true
  },
  preview: {
    port: PORT,
    host: true
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook")
          })
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium"
              }
            ]
          },
          setupFiles: [".storybook/vitest.setup.ts"]
        }
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvc2huZW9yIHJhYmlub3ZpdGNoL0RvY3VtZW50cy9jb2RlL3N0dWRlbnQtbWFuYWdtYW50L2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvVXNlcnMvc2huZW9yIHJhYmlub3ZpdGNoL0RvY3VtZW50cy9jb2RlL3N0dWRlbnQtbWFuYWdtYW50L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvYy9Vc2Vycy9zaG5lb3IlMjByYWJpbm92aXRjaC9Eb2N1bWVudHMvY29kZS9zdHVkZW50LW1hbmFnbWFudC9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0L2NvbmZpZ1wiIC8+XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IHN0b3J5Ym9va1Rlc3QgfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLXZpdGVzdC92aXRlc3QtcGx1Z2luJztcbmNvbnN0IGRpcm5hbWUgPVxuICB0eXBlb2YgX19kaXJuYW1lICE9PSAndW5kZWZpbmVkJyA/IF9fZGlybmFtZSA6IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xuXG4vLyBNb3JlIGluZm8gYXQ6IGh0dHBzOi8vc3Rvcnlib29rLmpzLm9yZy9kb2NzL25leHQvd3JpdGluZy10ZXN0cy9pbnRlZ3JhdGlvbnMvdml0ZXN0LWFkZG9uXG5jb25zdCBQT1JUID0gMzAzMDtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNoZWNrZXIoe1xuICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICAgIGVzbGludDoge1xuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxuICAgICAgICBkZXY6IHtcbiAgICAgICAgICBsb2dMZXZlbDogWydlcnJvciddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgcG9zaXRpb246ICd0bCcsXG4gICAgICAgIGluaXRpYWxJc09wZW46IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9ec3JjKC4rKS8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy8kMScpLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbiddLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiBQT1JULFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiBQT1JULFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBwcm9qZWN0czogW1xuICAgICAge1xuICAgICAgICBleHRlbmRzOiB0cnVlLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgLy8gVGhlIHBsdWdpbiB3aWxsIHJ1biB0ZXN0cyBmb3IgdGhlIHN0b3JpZXMgZGVmaW5lZCBpbiB5b3VyIFN0b3J5Ym9vayBjb25maWdcbiAgICAgICAgICAvLyBTZWUgb3B0aW9ucyBhdDogaHR0cHM6Ly9zdG9yeWJvb2suanMub3JnL2RvY3MvbmV4dC93cml0aW5nLXRlc3RzL2ludGVncmF0aW9ucy92aXRlc3QtYWRkb24jc3Rvcnlib29rdGVzdFxuICAgICAgICAgIHN0b3J5Ym9va1Rlc3Qoe1xuICAgICAgICAgICAgY29uZmlnRGlyOiBwYXRoLmpvaW4oZGlybmFtZSwgJy5zdG9yeWJvb2snKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgdGVzdDoge1xuICAgICAgICAgIG5hbWU6ICdzdG9yeWJvb2snLFxuICAgICAgICAgIGJyb3dzZXI6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBoZWFkbGVzczogdHJ1ZSxcbiAgICAgICAgICAgIHByb3ZpZGVyOiAncGxheXdyaWdodCcsXG4gICAgICAgICAgICBpbnN0YW5jZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyb3dzZXI6ICdjaHJvbWl1bScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dXBGaWxlczogWycuc3Rvcnlib29rL3ZpdGVzdC5zZXR1cC50cyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sYUFBYTtBQUNwQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFHbEIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxxQkFBcUI7QUFSOUIsSUFBTSxtQ0FBbUM7QUFBaU4sSUFBTSwyQ0FBMkM7QUFTM1MsSUFBTSxVQUNKLE9BQU8scUNBQWMsY0FBYyxtQ0FBWSxLQUFLLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBRzVGLElBQU0sT0FBTztBQUNiLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxRQUNiLEtBQUs7QUFBQSxVQUNILFVBQVUsQ0FBQyxPQUFPO0FBQUEsUUFDcEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsaUJBQWlCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBUSxPQUFPLE9BQU8sUUFBUSxRQUFRLE9BQU87QUFBQSxFQUM1RDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixVQUFVO0FBQUEsTUFDUjtBQUFBLFFBQ0UsU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBO0FBQUE7QUFBQSxVQUdQLGNBQWM7QUFBQSxZQUNaLFdBQVcsS0FBSyxLQUFLLFNBQVMsWUFBWTtBQUFBLFVBQzVDLENBQUM7QUFBQSxRQUNIO0FBQUEsUUFDQSxNQUFNO0FBQUEsVUFDSixNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsWUFDUCxTQUFTO0FBQUEsWUFDVCxVQUFVO0FBQUEsWUFDVixVQUFVO0FBQUEsWUFDVixXQUFXO0FBQUEsY0FDVDtBQUFBLGdCQUNFLFNBQVM7QUFBQSxjQUNYO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFlBQVksQ0FBQyw0QkFBNEI7QUFBQSxRQUMzQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
