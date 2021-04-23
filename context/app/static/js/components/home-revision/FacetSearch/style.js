import styled from 'styled-components';

const Background = styled.div`
  background-color: ${(props) => props.theme.palette.primary.main};
  width: 100%;
  padding: 20px;
  color: #fff;
`;

const FlexForm = styled.form`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
  margin-right: ${(props) => props.theme.spacing(5)}px;
`;

const StyledInput = styled.input`
  appearance: none !important;
  outline: none;
  flex-grow: 1;
  border-radius: 8px;
  border: 0;
  padding: 8px;
  font-size: 16px;
  color: ${(props) => props.theme.palette.text.primary};
`;

export { Background, FlexForm, StyledLabel, StyledInput };
