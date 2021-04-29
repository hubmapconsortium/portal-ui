import styled, { css } from 'styled-components';

import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';
import { invertSectionColors } from '../EntityTile/style';

const iconStyle = css`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => (props.$invertColors ? props.theme.palette.white.main : props.theme.palette.primary.main)};
`;

// If Support entities are shown, they can use the Dataset icon.

const StyledDatasetIcon = styled(DatasetIcon)`
  ${iconStyle};
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${iconStyle};
`;

const StyledDonorIcon = styled(DonorIcon)`
  ${iconStyle};
`;

// Width needs to be defined in px for text-overflow to work
const FixedWidthFlex = styled.div`
  display: flex;
  padding: 10px 10px;

  ${(props) =>
    invertSectionColors(props.theme.palette.white.main, props.theme.palette.primary.main, props.$invertColors)}
`;

export { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex };
