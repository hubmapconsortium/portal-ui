import React from 'react';
import ReactDOM from 'react-dom';

import Details from './components/Details'

export default function App(props) {
  if (window.location.pathname.indexOf('browse/dataset/') > -1) {
    return ReactDOM.render(
      <Details assayJSON={dataJSON} provJSON={provenanceJSON} vitJSON={vitJSON}/>,
      document.getElementById("react-details-content")
    );
  }
  return null;
};