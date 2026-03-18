import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { http, HttpResponse, passthrough } from 'msw';
import useSWR from 'swr';
import useCLIDtoLabel, {
  CellTypeLabelsForCLIDParams,
  useCLIDToLabelMapping,
  createCLIDtoLabelKey,
} from './useCLIDToLabel';

import { SCFIND_BASE_STORYBOOK } from './utils';
import StoryControlTemplate from './StoryTemplate';

// Story control for the default hook (single CLID lookup via Flask mapping)
function CLIDtoLabelControl(params: CellTypeLabelsForCLIDParams) {
  const result = useCLIDtoLabel(params);
  return <StoryControlTemplate title="CLID to Label (Single Lookup)" params={params} result={result} />;
}

// Story control for the full mapping endpoint
function FullMappingControl() {
  const result = useCLIDToLabelMapping();
  return <StoryControlTemplate title="Full CLID-to-Label Mapping" params={{}} result={result} />;
}

// Story control for direct scFind API call
function DirectApiControl(params: CellTypeLabelsForCLIDParams) {
  const key = createCLIDtoLabelKey(SCFIND_BASE_STORYBOOK, params);
  const result = useSWR<string[]>(key);
  return <StoryControlTemplate title="CLID to Label (Direct scFind API)" params={params} result={result} />;
}

const meta: Meta = {
  title: 'SCFind/CLIDtoLabel',
  parameters: {
    msw: {
      handlers: [
        // Passthrough direct scFind API requests
        http.get(`${SCFIND_BASE_STORYBOOK}/api/*`, () => {
          return passthrough();
        }),
        // Proxy Flask mapping endpoint to the webpack dev server (port 5001)
        // since Storybook runs on a different port and doesn't serve Flask routes
        http.get('/scfind/clid-to-label-map.json', async () => {
          const response = await fetch(`http://localhost:5001/scfind/clid-to-label-map.json`);
          return HttpResponse.json((await response.json()) as Record<string, string[]>);
        }),
      ],
    },
  },
  argTypes: {
    clid: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

// Test the default hook: looks up a single CLID from the Flask mapping endpoint
export const SingleLookup: StoryObj<typeof CLIDtoLabelControl> = {
  render: (args) => <CLIDtoLabelControl {...args} />,
  args: {
    clid: 'CL:0000236',
  },
};

// Test the full mapping helper endpoint
export const FullMapping: StoryObj<typeof FullMappingControl> = {
  render: () => <FullMappingControl />,
};

// Test the direct scFind CLID2CellType API endpoint
export const DirectScFindApi: StoryObj<typeof DirectApiControl> = {
  render: (args) => <DirectApiControl {...args} />,
  args: {
    clid: 'CL:0000236',
  },
};
