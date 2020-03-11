import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Container from '@material-ui/core/Container';

export default function NoticeAlert(props) {
  const generateErrorList = () => props.errors.map((errorObj, ind) => {
    if (errorObj.issue_url.length) {
      const base = 'https://github.com/hubmapconsortium/';
      const title = encodeURIComponent('Validation failure');
      let body = encodeURIComponent(`We have this validation error: ${errorObj.traceback}`);
      if (body.length > 1500) {
        body = `Note, traceback has been trimmed to 1500 chars./n ${body.slice(1500)}`;
      }
      // Body trim is a quick fix to avoid 414 error (2000 char limit).
      return (
        <li key={`${ind + 1}-error-msg`}>{errorObj.message} Unexpected bug!  File an issue:&nbsp;
          <a href={`${base}entity-api/issues/new?title=${title}&amp;body=${body.slice(1500)}`}>entity-api</a>
            &nbsp; or &nbsp;
          <a href={`${base}portal-ui/issues/new?title=${title}&amp;body=${body}`}>portal-ui</a>.
        </li>
      );
    }
    return (
      <li key={`${ind + 1}-error-url`}>{errorObj.message}.
        <a href={errorObj.issue_url}>Known Issue.</a>
      </li>
    );
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
