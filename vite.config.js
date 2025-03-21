import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import path from "path"
import fs from 'fs';


dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, './certs/localhost.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, './certs/localhost.cert'))
  //   }
  // },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})