import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useProtocolData from 'js/hooks/useProtocolData';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledSectionHeader, StyledPaper } from './style';
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
  const matchedDoiSuffix = protocol_url.match(/\w*$/)[0];

  const protocolData = useProtocolData(matchedDoiSuffix, 1);

  const title = protocolData?.protocol?.title;
  const resolverHostnameAndDOI = protocolData?.protocol?.doi;

  return (
    <DetailPageSection id="protocols">
      <StyledSectionHeader>
        Protocols
        <SecondaryBackgroundTooltip title="Protocols provided by protocol.io for the given donor.">
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </StyledSectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink title={title} resolverHostnameAndDOI={resolverHostnameAndDOI} />
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
