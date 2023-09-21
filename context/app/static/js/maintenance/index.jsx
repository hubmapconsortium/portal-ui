import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import initTrackers from '../helpers/init-trackers';

import App from './App';

initTrackers();

ReactDOM.render(<App />, document.getElementById('react-content'));
