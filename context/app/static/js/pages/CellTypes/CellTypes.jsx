import React from 'react';
import Typography from '@material-ui/core/Typography';

import theme from 'js/theme';
import SearchBarInput from 'js/shared-styles/inputs/SearchBar';
import Description from 'js/shared-styles/sections/Description';
import { useFlaskDataContext } from 'js/components/Contexts';
import OrganTile from 'js/components/organ/OrganTile';
import { Refresh, FilterList } from 'js/shared-styles/icons';

import { PageContainer, PageSectionContainer, OrganTilesContainer, CellTypesButton } from './style';

const CellTypes = () => {
  const { organs } = useFlaskDataContext();
  return (
    <PageContainer>
      <PageSectionContainer>
        <Typography variant="h2" component="h1">
          Cell Types
        </Typography>
        <Typography variant="subtitle1" color="primary">
          ## Cell Types
        </Typography>
        <Description padding={`${theme.spacing(2)}px`} withIcon={false}>
          Navigate the cell types available in the HuBMAP portal.
        </Description>
        <Description padding={`${theme.spacing(2)}px`}>
          To filter the cell type list in the table below by organ, select organ(s) in the anatomical view on the left
          or select from the list provided on the right by selecting the card. Selecting a cell type will navigate you
          to that cell type page with additional information about the cell type including visualizations and a list of
          HuBMAP data affiliated with that cell type.
        </Description>
      </PageSectionContainer>
      <PageSectionContainer>
        <CellTypesButton startIcon={<Refresh />}>Reset Filters</CellTypesButton>
        <OrganTilesContainer>
          {Object.values(organs).map((organ) => (
            <OrganTile organ={organ} />
          ))}
        </OrganTilesContainer>
      </PageSectionContainer>
      <PageSectionContainer>
        <CellTypesButton startIcon={<FilterList />}>Additional Filters</CellTypesButton>
        <SearchBarInput placeholder="Search Cell Type" />
      </PageSectionContainer>
    </PageContainer>
  );
};

export default CellTypes;
