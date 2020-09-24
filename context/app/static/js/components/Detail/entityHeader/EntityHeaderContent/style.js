import styled, { css } from 'styled-components';
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

export { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon };
