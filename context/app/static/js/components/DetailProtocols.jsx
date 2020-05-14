/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const LightText = styled(StyledTypography)`
  color: rgba(0, 0, 0, 0.54);
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

function ProtocolItem(props) {
  const { children, label } = props;
  return (
    <div>
      <LightText variant="body1">{label}</LightText>
      {children}
    </div>
  );
}

function DetailProtocols(props) {
  const { assayMetadata } = props;
  const { portal_uploaded_protocol_files } = assayMetadata;
  return (
    <div>
      <Typography variant="h3" component="h2">Protocols</Typography>
      <Divider />
      <StyledPaper>
        {portal_uploaded_protocol_files.map((protocol, i) => (
          <>
            {i !== 0 ? <Divider /> : null}
            <ProtocolItem label="Protocol URL">
              <StyledTypography variant="body1">
                {protocol.protocol_doi ? (
                  <StyledLink href={`https://${protocol.protocol_doi}`} target="_blank" rel="noopener noreferrer">
                    {protocol.protocol_doi}
                  </StyledLink>
                ) : 'No File Available'}
              </StyledTypography>
            </ProtocolItem>
            <ProtocolItem label="Image Files">
              <StyledTypography variant="body1">{protocol.protocol_file || 'No File Available'}</StyledTypography>
            </ProtocolItem>
          </>
        ))}
      </StyledPaper>
    </div>
  );
}

export default DetailProtocols;
