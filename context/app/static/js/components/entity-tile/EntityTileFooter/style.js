import styled, { css } from 'styled-components';

import { DatasetIcon, SampleIcon } from 'js/shared-styles/icons';

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

export { StyledDatasetIcon, StyledSampleIcon };
