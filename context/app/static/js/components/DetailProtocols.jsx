/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const StyledLink = styled(Link)`
  color: #3781D1;
`;

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

function DetailProtocols(props) {
  const { assayMetadata } = props;
  const { protocol_url, portal_uploaded_protocol_files } = assayMetadata;
  return (
    <div>
      <SectionHeader variant="h3" component="h2">Protocols</SectionHeader>
      <Divider />
      <StyledPaper>
        <SectionItem label="Protocol URL">
          <StyledTypography variant="body1">
            {protocol_url ? (
              <StyledLink href={`https://${protocol_url}`} target="_blank" rel="noopener noreferrer">
                {protocol_url}
              </StyledLink>
            ) : 'No File Available'}
          </StyledTypography>
        </SectionItem>
        {portal_uploaded_protocol_files && portal_uploaded_protocol_files.map((protocol, i) => (
          <>
            {i !== 0 || protocol_url ? <Divider /> : null}
            <SectionItem label="Protocol URL">
              <StyledTypography variant="body1">
                {protocol.protocol_doi ? (
                  <StyledLink href={`https://${protocol.protocol_doi}`} target="_blank" rel="noopener noreferrer">
                    {protocol.protocol_doi}
                  </StyledLink>
                ) : 'No File Available'}
              </StyledTypography>
            </SectionItem>
            <SectionItem label="Image Files">
              <StyledTypography variant="body1">{protocol.protocol_file || 'No File Available'}</StyledTypography>
            </SectionItem>
          </>
        ))}
      </StyledPaper>
    </div>
  );
}

export default DetailProtocols;
