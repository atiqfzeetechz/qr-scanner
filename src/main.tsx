import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import './i18n/index.js'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
