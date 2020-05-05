import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DataPanel from './DataPanel';
import RecursiveListLeaf from './RecursiveListLeaf';
import { isEmptyArrayOrObject } from '../helpers/functions';
import PanelTitle from './PanelTitle';


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

const IndentedContainer = styled.div`
  margin: 10px 0px 0px 15px;
`;

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
    <div>
      {
        isRootChild
          ? (
            <DataPanel propertyName={propertyName} isRootChild={isRootChild}>
              <MappedList property={property} />
            </DataPanel>
          ) : (
            <>
              {!(isRoot || isArray)
              && <PanelTitle propertyName={propertyName} />}
              <IndentedContainer>
                <MappedList property={property} isRoot={isRoot} />
              </IndentedContainer>
            </>
          )
        }
    </div>
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
