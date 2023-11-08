import React from 'react';
import ReactMarkdown from 'react-markdown';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { InternalLink } from 'js/shared-styles/Links';
import Skeleton from '@mui/material/Skeleton';
import { StyledPaper } from './style';

interface ReferenceBasedAnalysisProps {
  modalities: string;
  nunit: string;
  dataref: string;
}

export default function ReferenceBasedAnalysis({ modalities, nunit, dataref }: ReferenceBasedAnalysisProps) {
  return (
    <StyledPaper>
      <LabelledSectionText label="Modalities">{modalities}</LabelledSectionText>
      <LabelledSectionText label="Nuclei in reference">{nunit}</LabelledSectionText>
      <LabelledSectionText label="Reference dataset">
        <ReactMarkdown components={{ p: React.Fragment, a: InternalLink }}>{dataref}</ReactMarkdown>
      </LabelledSectionText>
    </StyledPaper>
  );
}

export function ReferenceBasedAnalysisSkeleton() {
  return (
    <StyledPaper>
      <LabelledSectionText label="Modalities">
        <Skeleton />
      </LabelledSectionText>
      <LabelledSectionText label="Nuclei in reference">
        <Skeleton />
      </LabelledSectionText>
      <LabelledSectionText label="Reference dataset">
        <Skeleton />
      </LabelledSectionText>
    </StyledPaper>
  );
}
