import React, { PropsWithChildren, useRef, ElementRef, AnimationEvent, MouseEvent, useCallback } from 'react';
import Box from '@mui/material/Box';

type StyledDetailsProps = PropsWithChildren<{
  summary: React.ReactNode;
  summaryBackgroundColor?: string;
}>;

function StyledDetails({ summary, children, summaryBackgroundColor = 'white' }: StyledDetailsProps) {
  const detailsRef = useRef<ElementRef<'details'>>(null);
  const summaryRef = useRef<ElementRef<'summary'>>(null);
  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (detailsRef.current?.hasAttribute('open')) {
      e.preventDefault();
      detailsRef.current.classList.add('closing');
    }
  }, []);
  const onAnimationEnd = useCallback((e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'details-hide') {
      detailsRef.current?.removeAttribute('open');
      detailsRef.current?.classList.remove('closing');
    }
  }, []);

  return (
    <Box
      component="details"
      overflow="none"
      position="relative"
      ref={detailsRef}
      onClick={onClick}
      onAnimationEnd={onAnimationEnd}
      sx={{
        // Animation for the contents of the details element
        '@keyframes details-show': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-25%)',
          },
          '25%': {
            opacity: 0.1,
          },
          '50%': {
            opacity: 0.25,
          },
          '75%': {
            opacity: 0.5,
          },
        },
        '@keyframes details-hide': {
          '0%': {
            opacity: 1,
          },
          '25%': {
            opacity: 0.25,
          },
          '50%': {
            opacity: 0.1,
          },
          '100%': {
            transform: 'translateY(-25%)',
            opacity: 0,
            height: 0,
          },
        },
        // Remove default marker and ensure summary is on top of the details element
        '& summary': {
          zIndex: 10,
          listStyle: 'none',
          position: 'relative',
          '&::-webkit-details-marker': {
            display: 'none',
          },
          // Show some indication that the summary is clickable on hover
          '&:hover': {
            textShadow: '0px 0px 5px #00000033',
            '&::after': {
              textShadow: 'unset',
            },
          },
        },
        // Animate the contents of the details element
        '& > *:not(summary)': {
          animation: 'details-show 0.25s ease-in-out',
          zIndex: 1,
          transition: 'all 0.3s ease-in-out',
          color: 'transparent',
        },
        '&.closing[open] > *:not(summary)': {
          animation: 'details-hide 0.25s ease-in-out',
        },
        '&[open]': {
          // Rotate the arrow when the details element is open
          '& summary::after': {
            transform: 'rotate(180deg)',
          },
          '& > *:not(summary)': {
            color: 'inherit',
          },
          // Rotate the arrow back as the details element is closing
          '&.closing > summary::after': {
            transform: 'rotate(0deg) translateY(15%)',
          },
        },
      }}
    >
      <Box
        component="summary"
        ref={summaryRef}
        sx={{
          cursor: 'pointer',
          backgroundColor: summaryBackgroundColor,
          display: 'block',
          '&::after': {
            transform: 'translateY(15%)',
            content: '"⌃"',
            fontSize: '1rem',
            display: 'inline-block',
            ml: 0.5,
            transition: 'transform 0.25s ease-in-out',
            color: 'primary.main',
          },
        }}
      >
        {summary}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}

export default StyledDetails;
