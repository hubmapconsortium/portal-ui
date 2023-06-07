import React from 'react';
import { LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import { Flex, FlexGrowChild, DropdownWrapper, DropdownAndLegendWrapper } from './style';

function ChartWrapper({ children, chartTitle, margin, colorScale, dropdown }) {
  return (
    <Flex>
      <FlexGrowChild>
        {chartTitle && (
          <TitleWrapper $leftOffset={margin.left - margin.right}>
            {chartTitle && <Typography>{chartTitle}</Typography>}
          </TitleWrapper>
        )}
        {children}
      </FlexGrowChild>
      <DropdownAndLegendWrapper $topOffset={margin.top}>
        {dropdown && <DropdownWrapper>{dropdown}</DropdownWrapper>}
        <LegendOrdinal
          scale={colorScale}
          labelMargin="0 15px 0 0"
          shapeStyle={() => ({
            borderRadius: '3px',
          })}
        />
      </DropdownAndLegendWrapper>
    </Flex>
  );
}

export default ChartWrapper;
