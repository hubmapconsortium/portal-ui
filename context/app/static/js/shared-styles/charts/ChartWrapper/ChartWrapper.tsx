import React, { PropsWithChildren } from 'react';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import Divider from '@mui/material/Divider';
import { OrdinalScale } from '../hooks';

interface ChartWrapperProps extends PropsWithChildren {
  chartTitle?: string;
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  colorScale: OrdinalScale;
  xAxisDropdown?: React.ReactNode;
  yAxisDropdown?: React.ReactNode;
  additionalControls?: React.ReactNode;
  dropdown?: React.ReactNode;
  allKeysScale?: OrdinalScale;
}

const pullUpMultiple = (a: string, b: string) => {
  if (a === 'Multiple') return -1;
  if (b === 'Multiple') return 1;
  return a.localeCompare(b);
};

function ChartWrapper({
  children,
  chartTitle,
  margin,
  colorScale,
  dropdown,
  xAxisDropdown,
  yAxisDropdown,
  additionalControls,
  allKeysScale,
}: ChartWrapperProps) {
  const domain = [...colorScale.domain()].sort(pullUpMultiple);
  const allKeysDomain = [...(allKeysScale?.domain() ?? [])].sort(pullUpMultiple);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: `
          "title        title        title        buttons"
          "top-controls top-controls top-controls top-controls"
          "y-axis       y-axis       y-axis       legend"
          "chart        chart        chart        legend"
          "x-axis       x-axis       x-axis       legend"
        `,
        overflow: 'none',
        gridTemplateColumns: 'auto auto auto fit-content(175px)',
        gridTemplateRows: 'auto auto minmax(0, auto) 500px minmax(0, auto)',
      }}
    >
      {chartTitle && (
        <TitleWrapper $leftOffset={margin.left - margin.right} sx={{ gridArea: 'title' }}>
          {chartTitle && <Typography>{chartTitle}</Typography>}
        </TitleWrapper>
      )}
      <Box sx={{ gridArea: 'y-axis', p: yAxisDropdown ? 1 : 0 }}>{yAxisDropdown}</Box>
      <Box sx={{ gridArea: 'chart' }}>{children}</Box>
      <Box sx={{ gridArea: 'x-axis', p: xAxisDropdown ? 1 : 0 }}>{xAxisDropdown}</Box>
      <Box sx={{ gridArea: 'legend', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflow: 'none' }}>
        {dropdown && <Box sx={{ marginY: 1, minWidth: 0 }}>{dropdown}</Box>}
        <Box sx={{ flex: 1, overflowY: 'auto' }} tabIndex={0}>
          <LegendOrdinal scale={colorScale} domain={domain}>
            {(labels) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {labels.map((label) => {
                  const isMultiple = label.text === 'Multiple';
                  return (
                    <>
                      <LegendItem key={`legend-${label.text}`} margin="0 15px 0 0">
                        <svg width="1em" height="1em" style={{ borderRadius: '4px' }}>
                          {isMultiple && (
                            <defs>
                              <pattern
                                id={`pattern-${label.text}`}
                                patternUnits="userSpaceOnUse"
                                width={domain.length}
                                height="2.5"
                                patternTransform="rotate(90)"
                              >
                                {domain.map((key, index) => (
                                  <line
                                    key={key}
                                    x1={index + 0.5}
                                    y1="0"
                                    x2={index + 0.5}
                                    y2="2.5"
                                    stroke={colorScale(key)}
                                    strokeWidth="1"
                                  />
                                ))}
                              </pattern>
                            </defs>
                          )}
                          <rect
                            fill={!isMultiple ? colorScale(label.text) : `url(#pattern-${label.text})`}
                            width="1em"
                            height="1em"
                          />
                        </svg>
                        <LegendLabel align="left" margin="0 0 0 4px">
                          {isMultiple ? (
                            <InfoTextTooltip tooltipTitle="This data has multiple categories">
                              {label.text}
                            </InfoTextTooltip>
                          ) : (
                            label.text
                          )}
                        </LegendLabel>
                      </LegendItem>
                      {isMultiple && <Divider sx={{ marginY: 1 }} />}
                    </>
                  );
                })}
              </div>
            )}
          </LegendOrdinal>
          {allKeysScale && (
            /* This is used to prevent content shift when toggling between different sets of data */
            <Box sx={{ height: 0, speak: 'none', overflow: 'hidden' }}>
              <LegendOrdinal scale={allKeysScale} domain={allKeysDomain} />
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ gridArea: 'top-controls' }}>{additionalControls}</Box>
    </Box>
  );
}

export default ChartWrapper;
