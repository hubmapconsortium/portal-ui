// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-elastic-ui/src/Facets/RangeSliderFacet/index.tsx
// Modified RangeSliderFacet to customize appearance and optimize rerenders.
import React, { useState } from 'react';
import { EuiDualRange } from '@elastic/eui';
import { useSearchkit } from '@searchkit/client';
import { useDebouncedCallback } from 'use-debounce';
import useDeepCompareEffect from 'use-deep-compare-effect';
import '@elastic/eui/dist/eui_theme_light.css';
import { useTheme } from '@mui/material/styles';

import { Flex, SliderLabel } from './style';

const getLevels = (e) =>
  e.reduce((levels, entry, index, entries) => {
    const lastLevel = levels[levels.length - 1];
    const isLast = entries.length === index + 1;
    if (!lastLevel || lastLevel.max) {
      levels.push({
        min: lastLevel ? lastLevel.max : parseFloat(entry.label),
        hasResults: entry.count !== 0,
      });
    } else if (
      lastLevel &&
      !lastLevel.max &&
      ((entry.count > 0 && !lastLevel.hasResults) ||
        (entry.count === 0 && lastLevel.hasResults) ||
        (isLast && !lastLevel.max))
    ) {
      lastLevel.max = parseFloat(entry.label);
      if (!isLast) {
        levels.push({
          min: parseFloat(entry.label),
          hasResults: entry.count !== 0,
        });
      }
    }
    return levels;
  }, []);

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

  const theme = useTheme();

  useDeepCompareEffect(() => {
    if (selectedOption) {
      setDualValue([selectedOptions[0].min, selectedOptions[0].max]);
    }
  }, [selectedOption, selectedOptions, setDualValue]);

  return (
    <Flex>
      <SliderLabel component="label" aria-hidden $isLeftLabel>
        {minBoundary}
      </SliderLabel>
      <EuiDualRange
        id={facet.identifier}
        value={dualValue}
        min={minBoundary}
        max={maxBoundary}
        onChange={(v) => {
          setDualValue(v);
          debouncedCallback(v);
        }}
        levels={levels.map((level) => ({
          min: level.min,
          max: level.max,
          color: level.hasResults ? theme.palette.success.light : theme.palette.error.light,
        }))}
      />
      <SliderLabel component="label" aria-hidden $isRightLabel>
        {maxBoundary}
      </SliderLabel>
    </Flex>
  );
}

export default RangeSliderFacet;
