import styled, { css } from 'styled-components';
import { InfoIcon, DatasetIcon, SampleIcon } from 'js/shared-styles/icons';

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)};
  font-size: 1.1rem;
  margin-bottom: ${(props) => props.theme.spacing(1)}; // To match SectionHeader
`;

const marginRightStyle = css`
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const StyledDatasetIcon = styled(DatasetIcon)`
  ${marginRightStyle}
`;

const StyledSampleIcon = styled(SampleIcon)`
  ${marginRightStyle}
`;

export { Flex, StyledInfoIcon, StyledDatasetIcon, StyledSampleIcon };
