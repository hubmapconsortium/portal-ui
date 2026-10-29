import React, { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { InfoIcon } from 'js/shared-styles/icons';

interface SectionDescriptionProps extends PropsWithChildren {
  addendum?: React.ReactNode;
  subsection?: boolean;
}

export function SectionDescription({ addendum, children, subsection }: SectionDescriptionProps) {
  const iconSize = subsection ? '1rem' : '1.5rem';
  const contents = (
    <Stack
      direction="column"
      sx={{
        gap: 1,
        marginBottom: subsection ? 2 : 0,
      }}
    >
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'start',
        }}
      >
        {/* Give the icon the same line box as the text, so `middle` centers it on the first line. */}
        <Typography component="span" variant="body1">
          <InfoIcon color="primary" fontSize={iconSize} sx={{ verticalAlign: 'middle' }} />
        </Typography>
        {/* Render as a <div> rather than the default <p> so callers can pass
            arbitrary block-level content (Stacks, additional Typography, action
            buttons, etc.) without producing invalid <p>-inside-<p> HTML. */}
        <Typography component="div" variant="body1">
          {children}
        </Typography>
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
