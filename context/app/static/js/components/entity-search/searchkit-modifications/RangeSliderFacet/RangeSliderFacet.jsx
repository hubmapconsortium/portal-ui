import React, { useState } from 'react';
import { useSearchkit } from '@searchkit/client';
import { useDebouncedCallback } from 'use-debounce';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useTheme } from '@mui/material/styles';

import Slider, { SliderRail } from '@mui/material/Slider';
import Box from '@mui/material/Box';

const getLevels = (e) =>
  e.reduce((levels, entry, index, entries) => {
    const lastLevel = levels[levels.length - 1];
    const isLast = entries.length === index + 1;
    const hasResults = entry.count !== 0;
    if (!lastLevel || lastLevel.max) {
      levels.push({
        min: lastLevel ? lastLevel.max : parseFloat(entry.label),
        hasResults,
        key: entry.label,
      });
    } else if (
      lastLevel &&
      !lastLevel.max &&
      ((hasResults && !lastLevel.hasResults) || (!hasResults && lastLevel.hasResults) || (isLast && !lastLevel.max))
    ) {
      lastLevel.max = parseFloat(entry.label);
      if (!isLast) {
        levels.push({
          min: parseFloat(entry.label),
          hasResults,
          key: entry.label,
        });
      }
    }
    return levels;
  }, []);

function DualSliderRail({ levels, min, max, ...props }) {
  const theme = useTheme();
  return (
    <SliderRail {...props} sx={{ backgroundColor: 'transparent' }}>
      <Box
        sx={{
          maxWidth: '100%',
          display: 'flex',
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
        }}
      >
        {levels.map((level) => (
          <Box
            key={level.key}
            aria-label={`${((level.max - level.min) / (max - min)) * 100}%`}
            sx={{
              width: `${((level.max - level.min) / (max - min)) * 100}%`,
              height: theme.spacing(1),
              backgroundColor: level.hasResults ? theme.palette.success.light : theme.palette.secondary.light,
              pointerEvents: 'none',
            }}
          />
        ))}
      </Box>
    </SliderRail>
  );
}

function RangeSliderFacet({ facet }) {
  // This is the only component that depends on elastic-ui. If removed, @elastic/eui, @elastic/datemath, @emotion/react, and @searchkit/elastic-ui can all be uninstalled.
  const api = useSearchkit();
  const levels = getLevels(facet.entries);
  const minBoundary = levels[0].min;
  const maxBoundary = levels[levels.length - 1].max;
  const [dualValue, setDualValue] = useState([minBoundary, maxBoundary]);
  const selectedOptions = api.getFiltersByIdentifier(facet.identifier);
  const selectedOption = selectedOptions && selectedOptions[0];
  const debouncedCallback = useDebouncedCallback((value) => {
    api.removeFiltersByIdentifier(facet.identifier);
    api.addFilter({ identifier: facet.identifier, min: value[0], max: value[1] });
    api.search();
  }, 400);

  useDeepCompareEffect(() => {
    if (selectedOption) {
      setDualValue([selectedOptions[0].min, selectedOptions[0].max]);
    }
  }, [selectedOption, selectedOptions, setDualValue]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Slider
        getAriaLabel={(index) => (index === 0 ? 'Minimum value' : 'Maximum value')}
        id={facet.identifier}
        value={dualValue}
        min={minBoundary}
        max={maxBoundary}
        slots={{ rail: DualSliderRail }}
        slotProps={{ rail: { levels, min: minBoundary, max: maxBoundary } }}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
          setDualValue(value);
          debouncedCallback(value);
        }}
        marks={[
          { value: minBoundary, label: minBoundary },
          { value: maxBoundary, label: maxBoundary },
        ]}
        sx={{
          ml: 1,
          mr: 2.5,
          '.MuiSlider-mark': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
}

export default RangeSliderFacet;
