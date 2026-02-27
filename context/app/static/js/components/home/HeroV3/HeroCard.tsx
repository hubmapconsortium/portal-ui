import React, { useRef } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { useEventCallback } from '@mui/material/utils';

import { trackEvent } from 'js/helpers/trackers';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';
import { CardContainer, CardVideoContainer } from './styles';

interface HeroCardProps {
  icon: MUIIcon;
  title: string;
  description: string;
  href: string;
  videoSrc?: string;
  posterSrc?: string;
}

export default function HeroCard({
  icon: Icon,
  title,
  description,
  href,
  videoSrc,
  posterSrc = 'https://unsplash.it/180/135',
}: HeroCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useEventCallback(() => {
    void videoRef.current?.play()?.catch(() => {
      // Video play may be blocked by browser policy
    });
  });

  const handleMouseLeave = useEventCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  });

  const handleClick = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: `Hero Card / ${title}`,
    });
  });

  return (
    <CardContainer href={href} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Icon sx={{ fontSize: '2rem' }} color="primary" />
          <Typography variant="h5" component="h3">
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {(videoSrc || posterSrc) && (
        <CardVideoContainer>
          {videoSrc ? (
            <video ref={videoRef} src={videoSrc} poster={posterSrc} muted loop playsInline preload="metadata" />
          ) : (
            posterSrc && <img src={posterSrc} alt="" />
          )}
        </CardVideoContainer>
      )}
      <Box sx={{ flexShrink: 0 }}>
        <ArrowForwardRounded color="action" />
      </Box>
    </CardContainer>
  );
}
