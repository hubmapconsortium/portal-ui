import React from 'react';
// import { useTheme } from '@material-ui/core/styles';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

function TwitterTimeline() {
  // const theme = useTheme();
  return (
    <div>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="_hubmap"
        options={{ height: 648, width: 360 }}
        transparent
      />
    </div>
  );
}

export default TwitterTimeline;
