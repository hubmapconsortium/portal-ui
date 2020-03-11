import React from 'react';
import ReactDOM from 'react-dom';
import Details from './components/Details';
import NoticeAlert from './components/NoticeAlert';

export default function App(props) {
  // Temp routing solution for showing the correct react component.
  const { flaskData } = props;

  const template = (
    <div>
      <NoticeAlert errors={flaskData.flashed_messages} />
      <Details
        assayMetaData={flaskData.entity}
        provData={flaskData.provenance}
        vitData={flaskData.vitessce_conf}
      />
    </div>
  );
  if (window.location.pathname.indexOf('browse/dataset/') > -1) {
    ReactDOM.render(template, document.getElementById('react-details-content'));
  }
  return null;
}
