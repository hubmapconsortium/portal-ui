import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Details from './components/Details';
import NoticeAlert from './components/NoticeAlert';
import Footer from './Footer';
import Header from './Header';


export default function App(props) {
  const { flaskData } = props;

  const getComponentView = () => {
    // Temp routing solution for showing the correct react component.
    if (window.location.pathname.indexOf('browse/') > -1) {
      return (
        <span>
          <NoticeAlert errors={flaskData.flashed_messages} />
          <Details
            assayMetaData={flaskData.entity}
            provData={flaskData.provenance}
            vitData={flaskData.vitessce_conf}
          />
        </span>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="page-layout">
        <Header />
        <div className="main-content">
          {getComponentView()}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
