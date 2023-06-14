import React from 'react';

import { PageContainer } from './style';
import CellTypeOrgans from '../../components/cellTypes/CellTypeOrgans';
import CellTypeHeader from '../../components/cellTypes/CellTypeHeader';
import CellTypesTable from '../../components/cellTypes/CellTypeTable';

const CellTypes = () => {
  return (
    <PageContainer>
      <CellTypeHeader />
      <CellTypeOrgans />
      <CellTypesTable />
    </PageContainer>
  );
};

export default CellTypes;
