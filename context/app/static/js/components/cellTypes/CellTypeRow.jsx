import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';

import { useInView } from 'react-intersection-observer';

import { StyledTableRow, StyledTableCell } from 'js/components/searchPage/ResultsTable/style';
import { useCellTypeDescription, useCellTypeOrgans } from './hooks';
import CellTypeDatasetsModal from './CellTypeDatasetsModal';

// type CellTypeRowProps = {
//     cellType: string;
// }

const CellTypeRow = ({ cellType }) => {
  // Delay loading description/organ information until row is in view
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: false,
    triggerOnce: true,
  });

  const { description, isLoading: descriptionIsLoading } = useCellTypeDescription(cellType, inView);
  const { organs, isLoading: organsAreLoading } = useCellTypeOrgans(cellType, inView);

  return (
    <StyledTableRow ref={ref}>
      <StyledTableCell>{cellType}</StyledTableCell>
      <StyledTableCell>{descriptionIsLoading ? <Skeleton /> : description}</StyledTableCell>
      <StyledTableCell>{organsAreLoading ? <Skeleton /> : organs}</StyledTableCell>
      <StyledTableCell>
        <CellTypeDatasetsModal cellType={cellType} />
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default CellTypeRow;
