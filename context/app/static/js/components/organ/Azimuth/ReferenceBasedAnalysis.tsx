import React from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/material/Box';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { useTheme } from '@mui/material';
import { StyledPaper } from './style';

interface ReferenceBasedAnalysisProps {
  modalities: string;
  nunit: string;
  dataref: string;
}

export default function ReferenceBasedAnalysis({ modalities, nunit, dataref }: ReferenceBasedAnalysisProps) {
  const theme = useTheme();
  return (
    <StyledPaper>
      <LabelledSectionText label="Modalities">{modalities}</LabelledSectionText>
      <LabelledSectionText label="Nuclei in reference">{nunit}</LabelledSectionText>
      <LabelledSectionText label="Reference dataset">
        <Box component="span" sx={{ '&>a': { color: theme.palette.info.main } }}>
          <ReactMarkdown components={{ p: React.Fragment }}>{dataref}</ReactMarkdown>
        </Box>
      </LabelledSectionText>
    </StyledPaper>
  );
}
