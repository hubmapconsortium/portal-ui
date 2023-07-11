import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import useProtocolData from 'js/hooks/useProtocolData';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledPaper } from './style';
import SectionItem from '../SectionItem';

function ProtocolLink({ title, resolverHostnameAndDOI }) {
  return (
    <SectionItem label={title}>
      {resolverHostnameAndDOI ? (
        <OutboundIconLink href={`https://${resolverHostnameAndDOI}`}>{resolverHostnameAndDOI}</OutboundIconLink>
      ) : (
        'Please wait...'
      )}
    </SectionItem>
  );
}

function Protocol({ protocol_url }) {
  const protocolData = useProtocolData(protocol_url, 1);

  return (
    <DetailPageSection id="protocols">
      <SectionHeader>Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        {protocolData.map(({ title, resolverHostnameAndDOI }) => (
          <ProtocolLink key={title} title={title} resolverHostnameAndDOI={resolverHostnameAndDOI} />
        ))}
      </StyledPaper>
    </DetailPageSection>
  );
}

Protocol.propTypes = {
  protocol_url: PropTypes.string,
};

Protocol.defaultProps = {
  protocol_url: '',
};

export default React.memo(Protocol);
