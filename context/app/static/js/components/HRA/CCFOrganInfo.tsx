import React from 'react';

import reactifyWc from 'reactify-wc';

import useScript from 'js/hooks/useScript';
import useLink from 'js/hooks/useLink';
import { HRAEvent } from './types';

interface CCFOrganInfoProps {
  uberonIri: string;
  dataSources?: string;
  onNodeClick?: (event: HRAEvent) => void;
  onSexChange?: (event: HRAEvent) => void;
  onSideChange?: (event: HRAEvent) => void;
}

interface RawOrganProps {
  'organ-iri': string;
  'remote-api-endpoint': string;
  'use-remote-api': string;
  nodeClick?: (event: HRAEvent) => void;
  sexChange?: (event: HRAEvent) => void;
  sideChange?: (event: HRAEvent) => void;
}

const defaultDataSources = '["https://apps.humanatlas.io/api/ds-graph/hubmap?token="]';

const HRAOrganScript = 'https://cdn.humanatlas.io/ui/ccf-organ-info/wc.js';
const HRAOrganStyles = 'https://cdn.humanatlas.io/ui/ccf-organ-info/styles.css';

const OrganInfo = reactifyWc('ccf-organ-info', {
  forceEvent: ['nodeClick', 'sexChange', 'sideChange'],
}) as React.FC<RawOrganProps>;

function CCFOrganInfo({
  uberonIri,
  dataSources = defaultDataSources,
  onNodeClick,
  onSexChange,
  onSideChange,
}: CCFOrganInfoProps) {
  useScript(HRAOrganScript);
  useLink(HRAOrganStyles);

  return (
    <OrganInfo
      organ-iri={uberonIri}
      data-sources={dataSources}
      nodeClick={onNodeClick}
      sexChange={onSexChange}
      sideChange={onSideChange}
    />
  );
}

export default CCFOrganInfo;
