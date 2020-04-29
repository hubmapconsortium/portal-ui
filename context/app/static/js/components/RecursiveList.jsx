import React from 'react';
/* import { makeStyles } from '@material-ui/core/styles'; */
import styled from 'styled-components';
/*
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'; */

const RecursivePropertyContainer = styled.div`
  padding-top: 5px;
  padding-left: 3px;
  margin-left: 10px;
  font-size: 16px;
`;

const PropertyName = styled.span`
  font-weight: bolder;
  font-size: 1rem;
`;


export default function RecursiveList(props) {
  const {
    property, propertyName, excludeBottomBorder, isRoot,
  } = props;

  return (
    <RecursivePropertyContainer excludeBottomBorder={excludeBottomBorder}>
      { property ? ( // eslint-disable-line no-nested-ternary
        (typeof property === 'number' || typeof property === 'string' || typeof property === 'boolean')
          ? (
            <>
              <PropertyName> {propertyName}: </PropertyName>
              {property.toString()}
            </>
          ) : (
            <>
              {!isRoot && <PropertyName> {propertyName}: </PropertyName>}
              {Object.values(property).map((objProperty, index, { length }) => (
                <RecursiveList
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  property={objProperty}
                  propertyName={Object.getOwnPropertyNames(property)[index]}
                  excludeBottomBorder={index === length - 1}
                />
              )) }
            </>
          )) : (<PropertyName> {propertyName}: </PropertyName>)}
    </RecursivePropertyContainer>
  );
}
