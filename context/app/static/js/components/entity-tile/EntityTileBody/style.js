import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';

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

const Flex = styled.div`
  display: flex;
  min-width: 0;
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
`;

export { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, Flex, TruncatedTypography, StyledDivider, StyledDiv };
