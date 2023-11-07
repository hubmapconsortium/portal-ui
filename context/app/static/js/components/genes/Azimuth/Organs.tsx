import React from 'react';
import OrganSelectionTile from './OrganSelectionTile';
import { useGeneOrgans } from '../hooks';

export default function GeneOrgans() {
  const { data } = useGeneOrgans();
  return (
    <div>
      {/* {data?.map((organ) => (
        <OrganSelectionTile name={organ.name} uberonId={`${organ.source}${organ.id}`} key={organ.id} />
      ))} */}
    </div>
  );
}
