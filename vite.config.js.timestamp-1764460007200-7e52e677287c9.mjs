// vite.config.js
import path from "path";
import checker from "file:///C:/Users/a0547/OneDrive/Documents/code/student-management-front/node_modules/vite-plugin-checker/dist/esm/main.js";
import { defineConfig } from "file:///C:/Users/a0547/OneDrive/Documents/code/student-management-front/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/a0547/OneDrive/Documents/code/student-management-front/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///C:/Users/a0547/OneDrive/Documents/code/student-management-front/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\a0547\\OneDrive\\Documents\\code\\student-management-front";
var __vite_injected_original_import_meta_url = "file:///C:/Users/a0547/OneDrive/Documents/code/student-management-front/vite.config.js";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var PORT = 3030;
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // Disable type checking and linting during build for deployment
    process.env.NODE_ENV !== "production" && checker({
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
  ].filter(Boolean),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhMDU0N1xcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcY29kZVxcXFxzdHVkZW50LW1hbmFnZW1lbnQtZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGEwNTQ3XFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxjb2RlXFxcXHN0dWRlbnQtbWFuYWdlbWVudC1mcm9udFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYTA1NDcvT25lRHJpdmUvRG9jdW1lbnRzL2NvZGUvc3R1ZGVudC1tYW5hZ2VtZW50LWZyb250L3ZpdGUuY29uZmlnLmpzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3QvY29uZmlnXCIgLz5cclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XHJcbmltcG9ydCB7IHN0b3J5Ym9va1Rlc3QgfSBmcm9tICdAc3Rvcnlib29rL2FkZG9uLXZpdGVzdC92aXRlc3QtcGx1Z2luJztcclxuY29uc3QgZGlybmFtZSA9XHJcbiAgdHlwZW9mIF9fZGlybmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBfX2Rpcm5hbWUgOiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcclxuXHJcbi8vIE1vcmUgaW5mbyBhdDogaHR0cHM6Ly9zdG9yeWJvb2suanMub3JnL2RvY3MvbmV4dC93cml0aW5nLXRlc3RzL2ludGVncmF0aW9ucy92aXRlc3QtYWRkb25cclxuY29uc3QgUE9SVCA9IDMwMzA7XHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIC8vIERpc2FibGUgdHlwZSBjaGVja2luZyBhbmQgbGludGluZyBkdXJpbmcgYnVpbGQgZm9yIGRlcGxveW1lbnRcclxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgY2hlY2tlcih7XHJcbiAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXHJcbiAgICAgIGVzbGludDoge1xyXG4gICAgICAgIGxpbnRDb21tYW5kOiAnZXNsaW50IFwiLi9zcmMvKiovKi57anMsanN4LHRzLHRzeH1cIicsXHJcbiAgICAgICAgZGV2OiB7XHJcbiAgICAgICAgICBsb2dMZXZlbDogWydlcnJvciddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICBwb3NpdGlvbjogJ3RsJyxcclxuICAgICAgICBpbml0aWFsSXNPcGVuOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiAvXn4oLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9ec3JjKC4rKS8sXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjLyQxJyksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgZXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJ10sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IFBPUlQsXHJcbiAgICBob3N0OiB0cnVlLFxyXG4gIH0sXHJcbiAgcHJldmlldzoge1xyXG4gICAgcG9ydDogUE9SVCxcclxuICAgIGhvc3Q6IHRydWUsXHJcbiAgfSxcclxuICB0ZXN0OiB7XHJcbiAgICBwcm9qZWN0czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZXh0ZW5kczogdHJ1ZSxcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAvLyBUaGUgcGx1Z2luIHdpbGwgcnVuIHRlc3RzIGZvciB0aGUgc3RvcmllcyBkZWZpbmVkIGluIHlvdXIgU3Rvcnlib29rIGNvbmZpZ1xyXG4gICAgICAgICAgLy8gU2VlIG9wdGlvbnMgYXQ6IGh0dHBzOi8vc3Rvcnlib29rLmpzLm9yZy9kb2NzL25leHQvd3JpdGluZy10ZXN0cy9pbnRlZ3JhdGlvbnMvdml0ZXN0LWFkZG9uI3N0b3J5Ym9va3Rlc3RcclxuICAgICAgICAgIHN0b3J5Ym9va1Rlc3Qoe1xyXG4gICAgICAgICAgICBjb25maWdEaXI6IHBhdGguam9pbihkaXJuYW1lLCAnLnN0b3J5Ym9vaycpLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgICB0ZXN0OiB7XHJcbiAgICAgICAgICBuYW1lOiAnc3Rvcnlib29rJyxcclxuICAgICAgICAgIGJyb3dzZXI6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgaGVhZGxlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyOiAncGxheXdyaWdodCcsXHJcbiAgICAgICAgICAgIGluc3RhbmNlczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyb3dzZXI6ICdjaHJvbWl1bScsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR1cEZpbGVzOiBbJy5zdG9yeWJvb2svdml0ZXN0LnNldHVwLnRzJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUdsQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLHFCQUFxQjtBQVI5QixJQUFNLG1DQUFtQztBQUEwTSxJQUFNLDJDQUEyQztBQVNwUyxJQUFNLFVBQ0osT0FBTyxxQ0FBYyxjQUFjLG1DQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFHNUYsSUFBTSxPQUFPO0FBQ2IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixRQUFRLElBQUksYUFBYSxnQkFBZ0IsUUFBUTtBQUFBLE1BQy9DLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxRQUNiLEtBQUs7QUFBQSxVQUNILFVBQVUsQ0FBQyxPQUFPO0FBQUEsUUFDcEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLGlCQUFpQjtBQUFBLE1BQ3pEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsUUFBUTtBQUFBLE1BQ2hEO0FBQUEsSUFDRjtBQUFBLElBQ0EsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxPQUFPO0FBQUEsRUFDNUQ7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQTtBQUFBO0FBQUEsVUFHUCxjQUFjO0FBQUEsWUFDWixXQUFXLEtBQUssS0FBSyxTQUFTLFlBQVk7QUFBQSxVQUM1QyxDQUFDO0FBQUEsUUFDSDtBQUFBLFFBQ0EsTUFBTTtBQUFBLFVBQ0osTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFlBQ1AsU0FBUztBQUFBLFlBQ1QsVUFBVTtBQUFBLFlBQ1YsVUFBVTtBQUFBLFlBQ1YsV0FBVztBQUFBLGNBQ1Q7QUFBQSxnQkFDRSxTQUFTO0FBQUEsY0FDWDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxZQUFZLENBQUMsNEJBQTRCO0FBQUEsUUFDM0M7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
