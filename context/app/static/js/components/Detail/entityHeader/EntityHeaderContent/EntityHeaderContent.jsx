import React from 'react';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon } from './style';
import EntityHeaderItem from '../EntityHeaderItem';

const iconMap = {
  Dataset: <StyledDatasetIcon />,
  Sample: <StyledSampleIcon />,
  Donor: <StyledDonorIcon />,
};

function EntityHeaderContent({ display_doi, entity_type, data }) {
  return (
    <>
      {iconMap[entity_type]}
      <EntityHeaderItem text={display_doi} />
      {Object.entries(data).map(([k, v]) => v && <EntityHeaderItem text={v} key={k} />)}
    </>
  );
}

export default EntityHeaderContent;
