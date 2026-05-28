import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// Side-effect import: instantiates Matomo + GA4 at module load time.
import '../helpers/trackers';

import App from './App';

createRoot(document.getElementById('react-content')!).render(<App />);
