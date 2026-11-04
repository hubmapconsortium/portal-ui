import React, { PropsWithChildren } from 'react';
import { useTheme } from '@mui/material/styles';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { AnyD3Scale } from '@visx/scale';

interface VerticalChartGridRowsGroupProps<YAxisScale extends AnyD3Scale> extends PropsWithChildren {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  yScale: YAxisScale;
  xWidth: number;
  getTickValues?: (yScale: YAxisScale) => number[];
}

function VerticalChartGridRowsGroup<YAxisScale extends AnyD3Scale>({
  children,
  margin: { left, top },
  yScale,
  xWidth,
  getTickValues,
}: VerticalChartGridRowsGroupProps<YAxisScale>) {
  const theme = useTheme();
  return (
    <>
      <GridRows
        top={top}
        left={left}
        scale={yScale}
        width={xWidth}
        stroke={theme.palette.text.primary}
        opacity={0.2}
        tickValues={getTickValues?.(yScale)}
      />
      <Group top={top} left={left}>
        {children}
      </Group>
    </>
  );
}

export default VerticalChartGridRowsGroup;
