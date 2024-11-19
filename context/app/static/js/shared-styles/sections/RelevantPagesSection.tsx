import React from 'react';
import Stack from '@mui/material/Stack';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';

interface RelevantPagesSectionProps {
  pages: {
    link: string;
    children: React.ReactNode;
    onClick?: () => void;
    external?: boolean;
  }[];
}
function RelevantPagesSection({ pages }: RelevantPagesSectionProps) {
  return (
    <LabelledSectionText label="Relevant Pages" spacing={1}>
      <Stack direction="row" spacing={1}>
        {pages.map((page) => {
          return <OutlinedLinkButton key={page.link} {...page} />;
        })}
      </Stack>
    </LabelledSectionText>
  );
}

export default RelevantPagesSection;
