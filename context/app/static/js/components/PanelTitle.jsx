import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmptyArrayOrObject, replaceUnderscore } from '../helpers/functions';


/* eslint-disable no-confusing-arrow */
const PropertyName = styled.span`
  font-weight: bolder;
  font-size: ${(props) => (props.isRootChild ? '1.2rem' : '1rem')};
  text-transform: capitalize;
`;

const Property = styled.span`
  font-size: ${(props) => (props.isRootChild ? '1.1rem' : '1rem')};
`;
/* eslint-enable no-confusing-arrow */


function PanelTitle(props) {
  const {
    propertyName, property, isRootChild, isDataPanelTitle,
  } = props;
  return (
    <div>
      <PropertyName isRootChild={isRootChild}>
        {replaceUnderscore(propertyName)}
        {!isDataPanelTitle && <>: </> }
      </PropertyName>
      {property && !isEmptyArrayOrObject(property) && (
        <Property isRootChild={isRootChild}>{property}</Property>
      )}
    </div>
  );
}

PanelTitle.propTypes = {
  propertyName: PropTypes.string.isRequired,
  isRootChild: PropTypes.bool,
  isDataPanelTitle: PropTypes.bool,

};

PanelTitle.defaultProps = {
  isRootChild: false,
  isDataPanelTitle: false,
};

export default PanelTitle;
