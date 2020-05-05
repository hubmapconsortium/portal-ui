import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DataPanel from './DataPanel';
import RecursiveListLeaf from './RecursiveListLeaf';
import { isEmptyArrayOrObject, replaceUnderscore } from '../helpers/functions';

const RecursivePropertyContainer = styled.div`
  margin-top: 5px;
  font-size: 16px;
`;

const PropertyName = styled.span`
  font-weight: bolder;
  font-size: 1rem;
`;

function isLeaf(property) {
  return (new Set(['number', 'string', 'boolean']).has(typeof property) || isEmptyArrayOrObject(property));
}

function MappedList(props) {
  const { property, isRoot } = props;
  return (Object.values(property).map((childProperty, index) => (
    <RecursiveList
      key={Object.getOwnPropertyNames(property)[index]}
      property={childProperty}
      propertyName={Object.getOwnPropertyNames(property)[index]}
      isRootChild={isRoot}
      isArray={property.constructor.name === 'Array'}
    />
  )));
}
function RecursiveList(props) {
  const {
    property, propertyName, isRoot, isRootChild, isArray,
  } = props;

  if (!property) return (<RecursiveListLeaf property="" propertyName={propertyName} isRootChild={isRoot} />);

  if (isLeaf(property)) {
    return (
      <RecursiveListLeaf
        property={property}
        propertyName={propertyName}
        isRootChild={isRootChild}
      />
    );
  }

  return (
    <RecursivePropertyContainer>
      {
        isRootChild
          ? (
            <DataPanel propertyName={propertyName} isRootChild={isRootChild}>
              <MappedList property={property} />
            </DataPanel>
          ) : (
            <>
              {!(isRoot || isArray)
              && <PropertyName> {replaceUnderscore(propertyName)}: </PropertyName>}
              <MappedList property={property} isRoot={isRoot} />
            </>
          )
        }
    </RecursivePropertyContainer>
  );
}

RecursiveList.propTypes = {
  propertyName: PropTypes.string.isRequired,
  isRoot: PropTypes.bool,
  isRootChild: PropTypes.bool,
  isArray: PropTypes.bool,
};

RecursiveList.defaultProps = {
  isRoot: false,
  isRootChild: false,
  isArray: false,
};

export default RecursiveList;
