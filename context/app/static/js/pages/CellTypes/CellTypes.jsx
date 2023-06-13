import React from 'react';
import Typography from '@material-ui/core/Typography';

import Description from '../../shared-styles/sections/Description';
import { PageContainer, PageHeadContainer } from './style';
import theme from '../../theme';

const CellTypes = () => {
  return (
    <PageContainer>
      <PageHeadContainer>
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
      </PageHeadContainer>
      <div>Organ tiles placeholder</div>
      <div>Cell Type search table placeholder</div>
    </PageContainer>
  );
};

export default CellTypes;
