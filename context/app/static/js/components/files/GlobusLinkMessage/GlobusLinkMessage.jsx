import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import FilesContext from '../Files/context';
import FilesConditionalLink from '../FilesConditionalLink';
import { StyledExternalLinkIcon } from './style';

const messages = {
  401: 'Unauthorized access to the Globus Research Management System (bad or expired token). If you believe this to be an error, please contact',
  403: 'Access to files on the Globus Research Management system are restricted. You may not have access to these files because the Consortium is still curating data and/or the data is protected data that requires you to be a member of the Consortium “Protected Data Group”. Such protected data will be available via dbGaP in the future. If you believe this to be an error, please contact',
  404: 'Files are not available through the Globus Research Management system. If you believe this to be an error, please contact',
  500: 'Unexpected server or other error. Report error to',
};

function GlobusLinkMessage(props) {
  const { statusCode, url, hubmap_id, isSupport } = props;
  const { hasAgreedToDUA, openDUA } = useContext(FilesContext);

  if (statusCode === null) {
    return null;
  }

  if (statusCode === 200) {
    const globusLink = (
      <FilesConditionalLink href={url} hasAgreedToDUA={hasAgreedToDUA} openDUA={() => openDUA(url)} variant="body2">
        Globus <StyledExternalLinkIcon />
      </FilesConditionalLink>
    );
    return (
      <Typography variant="body2">
        {isSupport
          ? 'Data generated for visualization of this dataset are also available.'
          : 'Files are available through the Globus Research Data Management System.'}{' '}
        {`Access ${isSupport ? 'support' : ''} dataset ${hubmap_id} on `}
        {globusLink}.
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
  statusCode: PropTypes.number,
  url: PropTypes.string,
  hubmap_id: PropTypes.string,
};

GlobusLinkMessage.defaultProps = {
  statusCode: null,
  url: '',
  hubmap_id: '',
};

export default GlobusLinkMessage;
