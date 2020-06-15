import React from 'react';
// import { useTheme } from '@material-ui/core/styles';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { Wrapper } from './style';

function TwitterTimeline() {
  // const theme = useTheme();
  return (
    <Wrapper>
      <TwitterTimelineEmbed sourceType="profile" screenName="_hubmap" options={{ height: 624 }} transparent />
    </Wrapper>
  );
}

export default TwitterTimeline;
