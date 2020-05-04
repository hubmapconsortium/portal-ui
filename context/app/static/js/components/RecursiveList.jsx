import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DataPanel from './DataPanel';
import RecursiveListLeaf from './RecursiveListLeaf';
import { isEmptyArrayOrObject } from '../helpers/functions';

const RecursivePropertyContainer = styled.div`
  margin-top: 5px;
  font-size: 16px;
`;

const PropertyName = styled.span`
  font-weight: bolder;
  font-size: 1rem;
`;

function isLeaf(property) {
  return (typeof property === 'number' || typeof property === 'string' || typeof property === 'boolean' || isEmptyArrayOrObject(property));
}

function RecursiveList(props) {
  const {
    property, propertyName, isRoot, isRootChild,
  } = props;


  return (
    /* eslint-disable no-nested-ternary */
    <RecursivePropertyContainer>
      { property ? (
        isLeaf(property)
          ? (
            <RecursiveListLeaf
              property={property}
              propertyName={propertyName}
              isRootChild={isRootChild}
            />
          ) : (
            isRootChild
              ? (
                <DataPanel propertyName={propertyName} isRootChild={isRootChild}>
                  {Object.values(property).map((objProperty, index) => (
                    <RecursiveList
                    // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      property={objProperty}
                      propertyName={Object.getOwnPropertyNames(property)[index]}
                    />
                  )) }
                </DataPanel>
              ) : (
                <>
                  {!isRoot && <PropertyName> {propertyName}: </PropertyName>}
                  {Object.values(property).map((objProperty, index) => (
                    <RecursiveList
                  // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      property={objProperty}
                      propertyName={Object.getOwnPropertyNames(property)[index]}
                      isRootChild={isRoot}
                    />
                  )) }
                </>
              )
          )) : (<RecursiveListLeaf property="" propertyName={propertyName} isRootChild={isRoot} />)}
    </RecursivePropertyContainer>
  );
  /* eslint-disable no-nested-ternary */
}

RecursiveList.propTypes = {
  propertyName: PropTypes.string.isRequired,
  isRoot: PropTypes.bool,
  isRootChild: PropTypes.bool,
};

RecursiveList.defaultProps = {
  isRoot: false,
  isRootChild: false,
};

export default RecursiveList;
