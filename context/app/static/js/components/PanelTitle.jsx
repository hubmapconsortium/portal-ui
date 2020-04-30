import React from 'react';
import styled from 'styled-components';
import { isEmptyArrayOrObject } from '../helpers/functions';

/* eslint-disable no-confusing-arrow */
const PropertyName = styled.span`
  font-weight: bolder;
  font-size: ${(props) => (props.isRootChild ? '1.2rem' : '1rem')};
  text-transform: capitalize;
`;

const Property = styled.span`
  font-size: ${(props) => (props.isRootChild ? '1.1rem' : '1rem')};
  margin-left: 5px;
`;
/* eslint-disable no-confusing-arrow */

function replaceUnderscore(str) {
  return str.replace(/_/g, ' ');
}

export default function PanelTitle(props) {
  const {
    propertyName, property, isRootChild, isDataPanelTitle,
  } = props;
  return (
    <>
      <PropertyName isRootChild={isRootChild}>
        {replaceUnderscore(propertyName)}
        {!isDataPanelTitle && <>: </> }
      </PropertyName>
      {property && !isEmptyArrayOrObject(property) && (
        <Property isRootChild={isRootChild}>{property}</Property>
      )}
    </>
  );
}
