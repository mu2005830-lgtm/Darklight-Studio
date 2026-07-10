import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@/lib/api-client';

import App from './App';

import './index.css';

// The API is deployed as Vercel serverless functions under /api on the same
// domain as this frontend, so no base URL is needed by default. Set
// VITE_API_BASE_URL only if you split the API into a separate deployment.
const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (apiBase) setBaseUrl(apiBase);

createRoot(document.getElementById('root')!).render(<App />);
