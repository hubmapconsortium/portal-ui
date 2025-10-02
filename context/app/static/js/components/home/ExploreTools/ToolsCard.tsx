import React, { PropsWithChildren } from 'react';
import { animated, useTransition } from '@react-spring/web';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { useEventCallback } from '@mui/material/utils';

import { trackEvent } from 'js/helpers/trackers';
import { useIsDesktop, useIsMobile } from 'js/hooks/media-queries';

import { useCardGridContext } from './CardGridContext';
import { StyledImg } from './styles';

interface ToolsCardProps extends PropsWithChildren {
  title: string;
  index: number;
  src: string;
  icon?: React.ReactNode;
  alt: string;
}

function getFlexAlignment(index: number, cardCount: number) {
  const isFirstCard = index === 0;
  if (isFirstCard) {
    return 'flex-start';
  }
  const isLastCard = index === cardCount - 1;
  if (isLastCard) {
    return 'flex-end';
  }
  return 'center';
}

export function ToolsCard({ title, children: description, index, src, icon, alt }: ToolsCardProps) {
  const { expandedCardIndex, setExpandedCardIndex, cardCount } = useCardGridContext();
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const isTablet = !isDesktop && !isMobile;
  const isExpanded = expandedCardIndex === index || isTablet;
  const setIsExpanded = () => {
    setExpandedCardIndex(index);
  };
  const transition = useTransition(isExpanded && !isMobile, {
    duration: 200,
    from: { maxHeight: 0, opacity: 0, width: 0 },
    enter: { maxHeight: 'auto', opacity: 1, width: 'fit-content' },
    leave: { maxHeight: 0, opacity: 0, width: 0 },
  });
  const justifyContent = isDesktop ? getFlexAlignment(index, cardCount) : 'stretch';

  const handleExpand = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: 'Explore Tools & Resources',
      label: title,
    });
    setIsExpanded();
  });

  return (
    <Grid overflow="none" display="flex" justifyContent={justifyContent}>
      <Paper tabIndex={0} onFocus={handleExpand} onMouseOver={handleExpand} sx={{ overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <StyledImg src={src} alt={alt} width="auto" />
          {transition((style, isOpen) => {
            if (!isOpen || isMobile) {
              return null;
            }
            return <animated.div style={style}>{description}</animated.div>;
          })}
        </Stack>
        <Stack direction="row" alignItems="center" px={1}>
          <Box flexShrink={0}>{icon}</Box>
          <Typography variant="subtitle1" noWrap={isDesktop} py={2} pl={1}>
            {title}
          </Typography>
        </Stack>
        {isMobile && description}
      </Paper>
    </Grid>
  );
}
