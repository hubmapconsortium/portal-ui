import React from 'react';
import { LegendOrdinal } from '@visx/legend';
import Typography from '@material-ui/core/Typography';

import { TitleWrapper, Flex, FlexGrowChild } from './style';

function ChartWrapper({ children, chartTitle, margin, colorScale, dropdown }) {
  return (
    <Flex>
      <FlexGrowChild>
        <TitleWrapper $leftOffset={margin.left - margin.right}>
          {chartTitle && <Typography>{chartTitle}</Typography>}
        </TitleWrapper>
        {children}
      </FlexGrowChild>
      <div>
        {dropdown}
        <LegendOrdinal
          scale={colorScale}
          labelMargin="0 15px 0 0"
          shapeStyle={() => ({
            borderRadius: '3px',
          })}
        />
      </div>
    </Flex>
  );
}

export default ChartWrapper;
