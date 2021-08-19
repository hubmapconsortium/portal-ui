import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import FilesContext from '../Files/context';
import FilesConditionalLink from '../FilesConditionalLink';
import { StyledExternalLinkIcon } from './style';

const messages = {
  401: 'Unauthorized access to the Globus Research Management System (bad or expired token). If you believe this to be an error, please contact',
  403: 'Access to files on the Globus Research Management system is restricted. You may not have access to these files because the Consortium is still curating data and/or the data is protected data that requires you to be a member of the Consortium “Protected Data Group”. Such protected data will be available via dbGaP in the future. If you believe this to be an error, please contact',
  404: 'Files are not available through the Globus Research Management system. If you believe this to be an error, please contact',
  500: 'Unexpected server or other error. Report error to',
};

function GlobusLinkMessage(props) {
  const { statusCode, url, hubmap_id } = props;
  const { hasAgreedToDUA, openDUA } = useContext(FilesContext);

  if (statusCode === 200) {
    return (
      <Typography variant="body2">
        {`Files are available through the Globus Research Data Management System. Access dataset ${hubmap_id} on `}
        <FilesConditionalLink href={url} hasAgreedToDUA={hasAgreedToDUA} openDUA={() => openDUA(url)} variant="body2">
          Globus <StyledExternalLinkIcon />
        </FilesConditionalLink>
        .
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

  return (
    <Typography variant="body2">
      {`Unexpected error ${statusCode}. Report error to `}
      <LightBlueLink underline="none" variant="body2" href="mailto:help@hubmapconsortium.org">
        help@hubmapconsortium.org
      </LightBlueLink>
      .
    </Typography>
  );
}

GlobusLinkMessage.propTypes = {
  statusCode: PropTypes.number.isRequired,
  url: PropTypes.string,
  hubmap_id: PropTypes.string,
};

GlobusLinkMessage.defaultProps = {
  url: '',
  hubmap_id: '',
};

export default GlobusLinkMessage;
