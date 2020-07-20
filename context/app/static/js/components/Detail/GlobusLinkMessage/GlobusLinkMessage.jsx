import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'shared-styles/Links';
import { StyledExternalLinkIcon } from './style';

const messages = {
  401: 'Unauthorized access to the Globus Research Management System (bad or expired token). If you believe this to be an error, please contact',
  403: 'Access to files on the Globus Research Management system are restricted. You may not have access to these files because the Consortium is still curating data and/or the data is protected data that requires you to be a member of the Consortium “Protected Data Group”. Such protected data will be available via dbGaP in the future. If you believe this to be an error, please contact',
  404: 'Files are not available through the Globus Research Management system. If you believe this to be an error, please contact',
  500: 'Unexpected server or other error. Report error to',
};

function GlobusLinkMessage(props) {
  const { statusCode, url, display_doi } = props;

  if (statusCode === 200) {
    return (
      <Typography variant="body2">
        {`Files are available through the Globus Research Data Management System. Access dataset' ${display_doi} on `}
        <LightBlueLink underline="none" variant="body2" href={url}>
          Globus <StyledExternalLinkIcon />
        </LightBlueLink>
      </Typography>
    );
  }

  if (statusCode in messages) {
    return (
      <Typography variant="body2">
        {`${messages[statusCode]} `}
        <LightBlueLink underline="none" variant="body2" href="mailto:help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </LightBlueLink>
        .
      </Typography>
    );
  }

  // TODO get fallback message for unanticipated response statuses
  return (
    <Typography variant="body2">
      {`Unexpected ${statusCode}. Report error to `}
      <LightBlueLink underline="none" variant="body2" href="mailto:help@hubmapconsortium.org">
        help@hubmapconsortium.org
      </LightBlueLink>
      .
    </Typography>
  );
}

GlobusLinkMessage.propTypes = {
  statusCode: PropTypes.number.isRequired,
  url: PropTypes.oneOf([PropTypes.string, PropTypes.null]).isRequired,
  display_doi: PropTypes.string,
};

GlobusLinkMessage.defaultProps = {
  display_doi: '',
};

export default GlobusLinkMessage;
