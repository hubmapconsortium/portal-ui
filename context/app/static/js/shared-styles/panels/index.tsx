import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { capitalizeString } from 'js/helpers/functions';
import { InternalLink } from 'js/shared-styles/Links';

const overflowCss = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
} as const;

const PanelWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: theme.palette.common.hoverShadow,
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const TextWrapper = styled('div')(({ theme }) => ({
  whiteSpace: 'nowrap',
  minWidth: 0, // needed to handle overflow
  marginRight: theme.spacing(1),
}));

const TruncatedText = styled(Typography)(overflowCss);

const TruncatedLink = styled(InternalLink)({
  ...overflowCss,
  display: 'block', // text-overflow only applies to block elements
});

const CountsWrapper = styled('div')({
  flexShrink: 0,
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));

const PanelScrollBox = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    overflowY: 'scroll',
    marginTop: theme.spacing(1),
  },
}));

interface PanelProps {
  title: string;
  href: string;
  secondaryText: string;
  entityCounts: {
    donors: number;
    samples: number;
    datasets: number;
  };
}

function Panel({ title, href, secondaryText, entityCounts }: PanelProps) {
  return (
    <PanelWrapper>
      <TextWrapper>
        <TruncatedLink variant="subtitle1" href={href}>
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary">
          {secondaryText}
        </TruncatedText>
      </TextWrapper>
      <CountsWrapper>
        {Object.entries(entityCounts).map(([key, value]) => (
          <StyledTypography key={key} variant="caption">{`${value} ${capitalizeString(key)}`}</StyledTypography>
        ))}
      </CountsWrapper>
    </PanelWrapper>
  );
}

export { Panel, PanelScrollBox, PanelWrapper };
