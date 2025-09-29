import React, { ClassAttributes, HTMLAttributes } from 'react';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import Skeleton from '@mui/material/Skeleton';
import MarkdownRenderer from 'js/components/Markdown/MarkdownRenderer';
import { ExtraProps } from 'react-markdown';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';

interface ReferenceBasedAnalysisProps {
  modalities: string;
  nunit: string;
  dataref: string;
  wrapped?: boolean;
}

function MarkdownParagraph({
  children,
}: ClassAttributes<HTMLParagraphElement> & HTMLAttributes<HTMLParagraphElement> & ExtraProps) {
  return <>{children}</>;
}

export default function ReferenceBasedAnalysis({ modalities, nunit, dataref, wrapped }: ReferenceBasedAnalysisProps) {
  const Wrapper = wrapped ? DetailSectionPaper : React.Fragment;
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
    <DetailSectionPaper>
      <LabelledSectionText label="Modalities">
        <Skeleton />
      </LabelledSectionText>
      <LabelledSectionText label="Nuclei in reference">
        <Skeleton />
      </LabelledSectionText>
      <LabelledSectionText label="Reference dataset">
        <Skeleton />
      </LabelledSectionText>
    </DetailSectionPaper>
  );
}
