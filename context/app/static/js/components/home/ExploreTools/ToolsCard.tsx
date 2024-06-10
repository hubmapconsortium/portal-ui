import { Paper, Typography, Stack, Box } from '@mui/material';
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useIsDesktop } from 'js/hooks/media-queries';
import { animated, useTransition } from '@react-spring/web';
import { useCardGridContext } from './CardGridContext';
import { StyledImg } from './styles';

interface ToolsCardProps {
  title: string;
  index: number;
  src: string;
  expandedContent?: React.ReactNode;
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

export function ToolsCard({ title, expandedContent: description, index, src }: ToolsCardProps) {
  const { expandedCardIndex, setExpandedCardIndex, cardCount } = useCardGridContext();
  const isDesktop = useIsDesktop();
  const isExpanded = expandedCardIndex === index;
  const setIsExpanded = () => setExpandedCardIndex(index);
  const transition = useTransition(isExpanded && isDesktop, {
    duration: 200,
    from: { maxHeight: 0, opacity: 0, width: 0 },
    enter: { maxHeight: 'auto', opacity: 1, width: 'fit-content' },
    leave: { maxHeight: 0, opacity: 0, width: 0 },
  });
  const justifyContent = isDesktop ? getFlexAlignment(index, cardCount) : 'stretch';

  const wrappedDescription = <Box p={2}>{description}</Box>;
  return (
    <Grid overflow="none" display="flex" justifyContent={justifyContent}>
      <Paper tabIndex={0} onFocus={setIsExpanded} onMouseOver={setIsExpanded} sx={{ overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <StyledImg src={src} height="520" width="auto" alt="Alt text for test" />
          {transition((style, isOpen) => {
            if (!isOpen || !isDesktop) {
              return null;
            }
            return <animated.div style={style}>{wrappedDescription}</animated.div>;
          })}
        </Stack>
        <Typography variant="h5" noWrap={isDesktop} py={2} pl={1}>
          {title}
        </Typography>
        {!isDesktop && wrappedDescription}
      </Paper>
    </Grid>
  );
}
