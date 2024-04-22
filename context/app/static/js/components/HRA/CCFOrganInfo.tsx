import React from 'react';

import reactifyWc from 'reactify-wc';

import useScript from 'js/hooks/useScript';
import useLink from 'js/hooks/useLink';
import { HRAEvent } from './types';

interface CCFOrganInfoProps {
  uberonIri: string;
  dataSources?: string;
  remoteApi?: string;
  onNodeClick?: (event: HRAEvent) => void;
  onSexChange?: (event: HRAEvent) => void;
  onSideChange?: (event: HRAEvent) => void;
}

interface RawOrganProps {
  'organ-iri': string;
  'data-sources': string;
  'use-remote-api': string;
  nodeClick?: (event: HRAEvent) => void;
  sexChange?: (event: HRAEvent) => void;
  sideChange?: (event: HRAEvent) => void;
}

const defaultRemoteApiEndpoint = 'https://apps.humanatlas.io/hubmap-hra-api/v1';

const HRAOrganScript = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/organ-info/wc.js';
const HRAOrganStyles = 'https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-ui@3/organ-info/styles.css';

const OrganInfo = reactifyWc('ccf-organ-info', {
  forceEvent: ['nodeClick', 'sexChange', 'sideChange'],
}) as React.FC<RawOrganProps>;

function CCFOrganInfo({
  uberonIri,
  remoteApiEndpoint = defaultRemoteApiEndpoint,
  remoteApi = 'true',
  onNodeClick,
  onSexChange,
  onSideChange,
}: CCFOrganInfoProps) {
  useScript(HRAOrganScript);
  useLink(HRAOrganStyles);

  return (
    <OrganInfo
      organ-iri={uberonIri}
      use-remote-api={remoteApi}
      remote-api-endpoint={defaultRemoteApiEndpoint}
      nodeClick={onNodeClick}
      sexChange={onSexChange}
      sideChange={onSideChange}
    />
  );
}

export default CCFOrganInfo;
