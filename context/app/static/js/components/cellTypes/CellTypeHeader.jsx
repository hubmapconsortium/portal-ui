import React from 'react';

import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Description from 'js/shared-styles/sections/Description';
import theme from 'js/theme';

import { PageSectionContainer } from './style';
import { useCellTypesList } from './hooks';

const CellTypeHeader = () => {
  const { cellTypes } = useCellTypesList();
  return (
    <PageSectionContainer>
      <Typography variant="h2" component="h1">
        Cell Types
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {cellTypes ? cellTypes.length : <Skeleton variant="text" />} Cell Types
      </Typography>
      <Description padding={`${theme.spacing(2)}px`} withIcon={false}>
        Navigate the cell types available in the HuBMAP portal.
      </Description>
      <Description padding={`${theme.spacing(2)}px`}>
        To filter the cell type list in the table below by organ, select organ(s) in the anatomical view on the left or
        select from the list provided on the right by selecting the card. Selecting a cell type will navigate you to
        that cell type page with additional information about the cell type including visualizations and a list of
        HuBMAP data affiliated with that cell type.
      </Description>
    </PageSectionContainer>
  );
};

export default CellTypeHeader;
