import { defineConfig } from 'vite';
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  plugins: [
    monacoEditorPlugin({
      publicPath: 'monaco'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  assetsInclude: ['**/*.worker.js']
});
