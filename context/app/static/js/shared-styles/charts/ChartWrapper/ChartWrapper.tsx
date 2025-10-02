import React, { forwardRef, PropsWithChildren } from 'react';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { OrdinalScale } from '../hooks';

interface ChartWrapperProps extends PropsWithChildren {
  chartTitle?: string;
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  colorScale?: OrdinalScale;
  xAxisDropdown?: React.ReactNode;
  yAxisDropdown?: React.ReactNode;
  additionalControls?: React.ReactNode;
  dropdown?: React.ReactNode;
  allKeysScale?: OrdinalScale;
  dividersInLegend?: boolean;
  labelValueMap?: Record<string, string>;
  caption?: React.ReactNode;
}

const pullUpMultiple = (a: string, b: string) => {
  if (a === 'Multiple') return -1;
  if (b === 'Multiple') return 1;
  return a.localeCompare(b);
};

function ChartWrapper(
  {
    children,
    chartTitle,
    margin,
    colorScale,
    dropdown,
    xAxisDropdown,
    yAxisDropdown,
    additionalControls,
    allKeysScale,
    dividersInLegend,
    labelValueMap = {},
    caption,
  }: ChartWrapperProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const domain = [...(colorScale?.domain() ?? [])].sort(pullUpMultiple);
  const allKeysDomain = [...(allKeysScale?.domain() ?? [])].sort(pullUpMultiple);

  const hasAxisDropdown = Boolean(xAxisDropdown || yAxisDropdown);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: `
          "title          title         title          buttons"
          "top-controls   top-controls  top-controls   top-controls"
          "axis-controls  axis-controls axis-controls  legend"
          "chart          chart         chart          legend"
          "caption        caption       caption        caption"
        `,
        overflow: 'none',
        gridTemplateColumns: 'auto auto auto minmax(175px, max-content)',
        gridTemplateRows: 'auto auto minmax(0, auto) 500px minmax(0, auto)',
      }}
      ref={ref}
    >
      {chartTitle && (
        <TitleWrapper $leftOffset={margin.left - margin.right} sx={{ gridArea: 'title' }}>
          {chartTitle && <Typography>{chartTitle}</Typography>}
        </TitleWrapper>
      )}
      <Stack direction="row" gap={1} sx={{ gridArea: 'axis-controls', p: hasAxisDropdown ? 1 : 0 }}>
        {xAxisDropdown}
        {yAxisDropdown}
      </Stack>
      <Box sx={{ gridArea: 'chart' }}>{children}</Box>
      <Box sx={{ gridArea: 'legend', display: 'grid', maxHeight: '100%', overflow: 'none' }}>
        <Stack direction="column" pl={1}>
          {dropdown && <Box sx={{ marginY: 1, width: '100%', minWidth: 'fit-content' }}>{dropdown}</Box>}
          <Box sx={{ flex: 1, overflowY: 'auto', gridArea: 'legend', mt: dropdown ? 0 : 2 }} tabIndex={0}>
            {colorScale && (
              <LegendOrdinal scale={colorScale} domain={domain}>
                {(labels) => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {labels.map((label, idx) => {
                      const isMultiple = label.text === 'Multiple';
                      return (
                        <React.Fragment key={label.text}>
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
                              {labelValueMap[label.text] && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textSecondary"
                                  display="inline-block"
                                  ml={1}
                                >
                                  ({labelValueMap[label.text]})
                                </Typography>
                              )}
                            </LegendLabel>
                          </LegendItem>
                          {(isMultiple || (dividersInLegend && idx !== labels.length - 1)) && (
                            <Divider sx={{ marginY: 1 }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </LegendOrdinal>
            )}
            {allKeysScale && (
              /* This is used to prevent content shift when toggling between different sets of data */
              <Box sx={{ height: 0, speak: 'none', overflow: 'hidden' }}>
                <LegendOrdinal scale={allKeysScale} domain={allKeysDomain} />
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
      <Box sx={{ gridArea: 'top-controls' }}>{additionalControls}</Box>
      <Box sx={{ gridArea: 'caption', p: 1 }}>
        <Typography variant="caption" color="textSecondary">
          {caption}
        </Typography>
      </Box>
    </Box>
  );
}

export default forwardRef(ChartWrapper);
