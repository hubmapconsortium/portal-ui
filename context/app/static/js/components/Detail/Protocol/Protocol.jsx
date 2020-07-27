import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import { LightBlueLink } from 'shared-styles/Links';
import { StyledPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionItem from '../SectionItem';
import SectionContainer from '../SectionContainer';

function ProtocolLink(props) {
  const { protocolUrl: urlMinusProtocol } = props;
  return (
    <SectionItem label="Protocol URL">
      {urlMinusProtocol ? (
        <LightBlueLink href={`https://${encodeURI(urlMinusProtocol)}`} target="_blank" rel="noopener noreferrer">
          {urlMinusProtocol}
        </LightBlueLink>
      ) : (
        'No URL Available'
      )}
    </SectionItem>
  );
}

function Protocol(props) {
  const { protocol_url } = props;

  return (
    <SectionContainer id="protocols">
      <SectionHeader>Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        <ProtocolLink protocolUrl={protocol_url} />
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
