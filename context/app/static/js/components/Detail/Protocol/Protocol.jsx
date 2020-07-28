import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import { LightBlueLink } from 'shared-styles/Links';
import useProtocolData from 'hooks/useProtocolData';
import { StyledPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function ProtocolLink(props) {
  const { resolverHostnameAndDOI } = props;
  return (
    <SectionItem label="Protocol URL">
      {resolverHostnameAndDOI ? (
        <LightBlueLink href={`https://${resolverHostnameAndDOI}`} target="_blank" rel="noopener noreferrer">
          {doi}
        </LightBlueLink>
      ) : (
        'Please wait...'
      )}
    </SectionItem>
  );
}

function Protocol(props) {
  const { protocol_url } = props;

  const matchedDoiSuffix = protocol_url.match(/\w+$/)[0];

  const protocolData = useProtocolData(matchedDoiSuffix, 1);

  const resolverHostnameAndDOI = 'protocol' in protocolData && 'doi' in protocolData.protocol ? protocolData.protocol.doi : '';

  return (
    <SectionContainer id="protocols">
      <SectionHeader>Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink resolverHostnameAndDOI={resolverHostnameAndDOI} />
      </StyledPaper>
    </SectionContainer>
  );
}

Protocol.propTypes = {
  protocol_url: PropTypes.string,
};

Protocol.defaultProps = {
  protocol_url: '',
};

export default React.memo(Protocol);
