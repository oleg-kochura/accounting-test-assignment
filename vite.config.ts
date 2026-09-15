import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const src = fileURLToPath(new URL('./src', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    // Keep in sync with compilerOptions.paths in tsconfig.app.json
    alias: [
      { find: 'assets', replacement: `${src}/assets` },
      { find: 'components', replacement: `${src}/components` },
      { find: 'features', replacement: `${src}/features` },
      { find: 'lib', replacement: `${src}/lib` },
      { find: 'store', replacement: `${src}/store` },
      { find: 'types', replacement: `${src}/types` },
      { find: 'src', replacement: src },
    ],
  },
})
