import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import useProtocolData from 'js/hooks/useProtocolData';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledPaper } from './style';
import SectionItem from '../SectionItem';

function ProtocolLink(props) {
  const { title, resolverHostnameAndDOI } = props;
  return (
    <SectionItem label={title}>
      {resolverHostnameAndDOI ? (
        <OutboundLink href={`https://${resolverHostnameAndDOI}`}>{resolverHostnameAndDOI}</OutboundLink>
      ) : (
        'Please wait...'
      )}
    </SectionItem>
  );
}

function Protocol(props) {
  const { protocol_url } = props;

  const matchedDoiSuffix = protocol_url.match(/\w*$/)[0];

  const protocolData = useProtocolData(matchedDoiSuffix, 1);

  const title = protocolData?.protocol?.title;
  const resolverHostnameAndDOI = protocolData?.protocol?.doi;

  return (
    <SectionContainer id="protocols">
      <SectionHeader>Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink title={title} resolverHostnameAndDOI={resolverHostnameAndDOI} />
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
