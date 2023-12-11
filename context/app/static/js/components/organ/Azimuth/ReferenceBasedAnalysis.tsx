import React from 'react';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import Skeleton from '@mui/material/Skeleton';
import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
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
        <MarkdownRenderer components={{ p: React.Fragment }}>{dataref}</MarkdownRenderer>
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
