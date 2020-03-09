import React from 'react';
import ReactDOM from 'react-dom';
import Details from './components/Details'
import NoticeAlert from "./components/NoticeAlert";

export default function App(props) {
  // Temp routing solution for showing the correct react component.
  const template = (
    <div>
      <NoticeAlert errors={errorJSON}/>
      <Details assayJSON={dataJSON} provJSON={provenanceJSON} vitJSON={vitJSON}/>
    </div>
  );
  if (window.location.pathname.indexOf('browse/dataset/') > -1) {
    return ReactDOM.render(template, document.getElementById("react-details-content"));
  }
  return null;
};
