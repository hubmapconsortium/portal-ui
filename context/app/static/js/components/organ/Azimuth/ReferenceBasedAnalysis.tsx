import React from 'react';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import Skeleton from '@mui/material/Skeleton';
import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import { StyledPaper } from './style';

interface ReferenceBasedAnalysisProps {
  modalities: string;
  nunit: string;
  dataref: string;
  wrapped?: boolean;
}

export default function ReferenceBasedAnalysis({ modalities, nunit, dataref, wrapped }: ReferenceBasedAnalysisProps) {
  const Wrapper = wrapped ? StyledPaper : React.Fragment;
  return (
    <Wrapper>
      <LabelledSectionText label="Modalities">{modalities}</LabelledSectionText>
      <LabelledSectionText label="Cells in Reference">{nunit}</LabelledSectionText>
      <LabelledSectionText label="Reference Dataset">
        <MarkdownRenderer components={{ p: ({key, children}) => <React.Fragment key={key}>{children}</React.Fragment> }}>{dataref}</MarkdownRenderer>
      </LabelledSectionText>
    </Wrapper>
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
