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
  flex-wrap: wrap;
`;

const StyledLabel = styled.label`
  margin-right: ${(props) => props.theme.spacing(5)};
`;

const inputPadding = 8;

const StyledInput = styled.input`
  flex-grow: 1;
  appearance: none !important;
  outline: none;
  border-radius: 8px;
  border: 0;
  padding: ${inputPadding}px;
  font-size: 1rem;
  color: ${(props) => props.theme.palette.text.primary};
`;

export { Background, FlexForm, StyledLabel, StyledInput, inputPadding };
