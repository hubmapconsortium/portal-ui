import React from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { TimelineData } from './types';
import { InternalLink } from '../Links';
import { DownIcon } from '../icons';
import { useExpandableItems } from './hooks';

interface TimelineProps {
  data: TimelineData[];
  expandable?: boolean;
}

export default function Timeline({ data, expandable }: TimelineProps) {
  const { itemsToRender, isExpandable, isExpanded, handleExpand } = useExpandableItems(data, expandable);
  return (
    <MuiTimeline
      position="right"
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.1,
          flexShrink: 0,
          minWidth: '7rem',
        },
      }}
    >
      {itemsToRender.map((item, idx) => (
        <TimelineItem key={item.title}>
          <TimelineOppositeContent variant="body2">{item.date}</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" sx={{ my: 0 }}>
              {item.img}
            </TimelineDot>
            {idx < data.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <InternalLink href={item.titleHref} variant="subtitle2">
              {item.title}
            </InternalLink>
            <Typography variant="body2">{item.description}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
      {isExpandable && !isExpanded && (
        <TimelineItem
          onClick={handleExpand}
          onKeyDown={(e) => (e.key === 'Enter' ? handleExpand() : undefined)}
          sx={{ cursor: 'pointer', flexDirection: 'row', alignItems: 'center', minHeight: 0 }}
          tabIndex={0}
        >
          <TimelineOppositeContent />
          <TimelineSeparator>
            <TimelineDot color="primary" sx={{ my: 0 }}>
              <DownIcon fontSize="1.5rem" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="subtitle2" onClick={handleExpand}>
              Show More
            </Typography>
          </TimelineContent>
        </TimelineItem>
      )}
    </MuiTimeline>
  );
}
