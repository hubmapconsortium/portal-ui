import styled, { css } from 'styled-components';
import Container from '@material-ui/core/Container';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';

const iconStyle = css`
  font-size: 1.5rem;
  color: ${(props) => props.theme.palette.primary.main};
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledDatasetIcon = styled(DatasetIcon)`
  ${iconStyle}
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${iconStyle}
`;

const StyledDonorIcon = styled(DonorIcon)`
  ${iconStyle}
`;

const FlexContainer = styled(Container)`
  display: flex;
  height: 100%;
  align-items: center;
`;

const FullscreenToggleButton = styled(ToggleButton)`
  border: 0px;
  padding: 0px 10px;
  height: 35px;
`;

const RightDiv = styled.div`
  margin-left: auto;
  display: flex;
  height: 100%;
`;

export { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FlexContainer, FullscreenToggleButton, RightDiv };
