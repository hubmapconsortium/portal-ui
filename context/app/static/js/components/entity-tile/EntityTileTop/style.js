import styled, { css } from 'styled-components';

import { DatasetIcon, SampleIcon, DonorIcon } from 'shared-styles/icons';
import { tileWidth } from '../EntityTile/style';

const iconStyle = css`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => (props.$invertColors ? '#ffffff' : props.theme.palette.primary.main)};
`;

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
  width: ${tileWidth};
  padding: 10px 10px;
`;

export { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex };
