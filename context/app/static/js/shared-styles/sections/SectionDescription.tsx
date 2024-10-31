import React, { PropsWithChildren } from 'react';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';

interface SectionDescriptionProps extends PropsWithChildren {
  addendum?: React.ReactNode;
  subsection?: boolean;
}

export function SectionDescription({ addendum, children, subsection }: SectionDescriptionProps) {
  const iconSize = subsection ? '1rem' : '1.5rem';
  const contents = (
    <Stack direction="column" gap={1} marginBottom={subsection ? 2 : 0}>
      <Stack direction="row" gap={1} alignItems="center">
        <InfoIcon color="primary" fontSize={iconSize} />
        <Typography variant="body1">{children}</Typography>
      </Stack>
      {addendum}
    </Stack>
  );
  if (subsection) {
    return contents;
  }
  return (
    <DetailSectionPaper
      sx={(theme) => ({
        marginBottom: theme.spacing(1),
      })}
    >
      {contents}
    </DetailSectionPaper>
  );
}
