import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';
import { invertSectionColors } from '../EntityTile/style';

const iconStyle = css`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => (props.$invertColors ? props.theme.palette.white.main : props.theme.palette.primary.main)};
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
  padding: 10px 10px;

  ${(props) =>
    invertSectionColors(props.theme.palette.white.main, props.theme.palette.primary.main, props.$invertColors)}
`;

const Flex = styled.div`
  display: flex;
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) =>
    props.$invertColors ? props.theme.palette.white.main : props.theme.palette.text.primary};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledDiv = styled.div`
  min-width: 0;
  flex-grow: 1;
`;

export {
  StyledDatasetIcon,
  StyledSampleIcon,
  StyledDonorIcon,
  FixedWidthFlex,
  Flex,
  TruncatedTypography,
  StyledDivider,
  StyledDiv,
};
