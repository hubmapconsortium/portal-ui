import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import { Flex } from './style';

function SectionButtonRow({ leftText, buttons, ...props }) {
  return (
    <Flex {...props}>
      {leftText}
      {buttons && <div>{buttons}</div>}
    </Flex>
  );
}

SectionButtonRow.propTypes = {
  /**
   Text to be displayed in the left most available space. Usually a BottomAlignedTypography component.
  */
  leftText: PropTypes.element,
  /**
   Button(s) to be displayed in the right most available space.
  */
  buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

SectionButtonRow.defaultProps = {
  leftText: <div />, // required for spacing
  buttons: undefined,
};

const SpacedSectionButtonRow = styled(SectionButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
  min-height: 40px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { SpacedSectionButtonRow, BottomAlignedTypography };
export default SectionButtonRow;
