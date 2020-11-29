import styled, { css } from 'styled-components';
import Divider from '@material-ui/core/Divider';

import { DatasetIcon, SampleIcon } from 'js/shared-styles/icons';
import { invertSectionColors } from '../EntityTile/style';

const iconStyle = css`
  font-size: 0.9rem;
  height: 18px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledDatasetIcon = styled(DatasetIcon)`
  ${iconStyle};
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${iconStyle};
`;

const FixedWidthFlex = styled.div`
  display: flex;
  padding: 0 ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.palette.white.main};
  ${(props) =>
    invertSectionColors(props.theme.palette.primary.main, props.theme.palette.white.main, props.$invertColors)}
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) =>
    props.$invertColors ? props.theme.palette.primary.main : props.theme.palette.white.main};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

export { FixedWidthFlex, StyledDivider, StyledDatasetIcon, StyledSampleIcon };
