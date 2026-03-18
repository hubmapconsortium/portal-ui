import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import initTrackers from '../helpers/init-trackers';

import App from './App';

initTrackers();

createRoot(document.getElementById('react-content')!).render(<App />);
