import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Container from '@material-ui/core/Container';

export default function NoticeAlert(props) {
  const generateErrorList = () => props.errors.map((errorObj, ind) => {
    let template = (
      <li key={`${ind + 1}-error-url`}>{errorObj.message}.
        <a href={errorObj.issue_url}>Known Issue.</a>
      </li>
    );
    if (!errorObj.issue_url.length) {
      const base = 'https://github.com/hubmapconsortium/';
      const title = encodeURIComponent('Validation failure');
      const body = encodeURIComponent(`We have this validation error: ${errorObj.traceback}`);
      template = (
        <li key={`${ind + 1}-error-msg`}>{errorObj.message} Unexpected bug!  File an issue:&nbsp;
          <a href={`${base}entity-api/issues/new?title=${title}&amp;body=${body}`}>entity-api</a>
            &nbsp; or &nbsp;
          <a href={`${base}portal-ui/issues/new?title=${title}&amp;body=${body}`}>portal-ui</a>.
        </li>
      );
    }
    return template;
  });

  return (
    <Container maxWidth="lg">
      <Alert severity="warning">
        <AlertTitle> Warning!</AlertTitle>
        <ul>
          {generateErrorList()}
        </ul>
      </Alert>
    </Container>
  );
}
