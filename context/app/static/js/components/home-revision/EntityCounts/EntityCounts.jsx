import React from 'react';
import EntityCount from 'js/components/home-revision/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon } from 'js/shared-styles/icons';
import { Background, FlexContainer } from './style';

function EntityCounts() {
  return (
    <Background>
      <FlexContainer>
        <EntityCount icon={DonorIcon} label="Donors" count={2} />
        <EntityCount icon={SampleIcon} label="Samples" count={2} />
        <EntityCount icon={DatasetIcon} label="Datasets" count={2} />
        <EntityCount icon={CollectionIcon} label="Collections" count={2} />
      </FlexContainer>
    </Background>
  );
}

export default EntityCounts;
