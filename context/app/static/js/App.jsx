import React from 'react';
import ReactDOM from 'react-dom';

import Details from './components/Details'

export default function App(props) {
  console.log(props);
  let viewID = "react-details-content";
  function getViewComponent () {
    if (window.location.pathname.indexOf('browse/dataset') > -1) {
      return <Details data={dataJson}/>
    }
    return <div></div>;
  }

  return ReactDOM.render(getViewComponent(), document.getElementById("react-details-content"));
};