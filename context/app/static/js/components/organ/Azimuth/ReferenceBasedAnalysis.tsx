import React, { ClassAttributes, HTMLAttributes } from 'react';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import Skeleton from '@mui/material/Skeleton';
import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import { ExtraProps } from 'react-markdown';
import { StyledPaper } from './style';

interface ReferenceBasedAnalysisProps {
  modalities: string;
  nunit: string;
  dataref: string;
  wrapped?: boolean;
}

function MarkdownParagraph({
  key,
  children,
}: ClassAttributes<HTMLParagraphElement> & HTMLAttributes<HTMLParagraphElement> & ExtraProps) {
  return <React.Fragment key={key}>{children}</React.Fragment>;
}

export default function ReferenceBasedAnalysis({ modalities, nunit, dataref, wrapped }: ReferenceBasedAnalysisProps) {
  const Wrapper = wrapped ? StyledPaper : React.Fragment;
  return (
    <Wrapper>
      <LabelledSectionText label="Modalities">{modalities}</LabelledSectionText>
      <LabelledSectionText label="Cells in Reference">{nunit}</LabelledSectionText>
      <LabelledSectionText label="Reference Dataset">
        <MarkdownRenderer components={{ p: MarkdownParagraph }}>{dataref}</MarkdownRenderer>
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
