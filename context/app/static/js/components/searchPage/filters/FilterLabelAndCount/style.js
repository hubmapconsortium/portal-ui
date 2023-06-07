import styled, { css } from 'styled-components';
import Typography from '@mui/material/Typography';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  p {
    font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
    ${(props) =>
      props.$active &&
      css`
        font-weight: ${props.theme.typography.subtitle1.fontWeight};
      `};
  }
`;

const FormLabelText = styled(Typography)`
  margin-right: 2px;
`;

export { Flex, FormLabelText };
