import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  p {
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
