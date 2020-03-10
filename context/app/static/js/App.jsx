import React from 'react';
import ReactDOM from 'react-dom';
import Details from './components/Details';
import NoticeAlert from './components/NoticeAlert';

export default function App(props) {
  // Temp routing solution for showing the correct react component.
  const {
    flashedMessages, entity, provenance, vitessceConf,
  } = props;
  const template = (
    <div>
      <NoticeAlert errors={flashedMessages} />
      <Details assay={entity} provData={provenance} vitData={vitessceConf} />
    </div>
  );
  if (window.location.pathname.indexOf('browse/dataset/') > -1) {
    ReactDOM.render(template, document.getElementById('react-details-content'));
  }
  return null;
}
