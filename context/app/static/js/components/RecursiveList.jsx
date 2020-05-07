import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
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
      isIndexZero={index === 0}
      key={Object.getOwnPropertyNames(property)[index]}
      property={childProperty}
      propertyName={Object.getOwnPropertyNames(property)[index]}
      isRootChild={isRoot}
      isArray={property.constructor.name === 'Array'}
    />
  )));
}

const IndentedContainer = styled.div`
  margin: ${(props) => (props.isRoot ? '5px 0px 5px 0px' : '5px 0px 5px 15px')};
`;

function RecursiveList(props) {
  const {
    property, propertyName, isRoot, isRootChild, isArray, isIndexZero,
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
              {isArray && !isIndexZero && <Divider />}
              <IndentedContainer isRoot={isRoot}>
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
  isIndexZero: PropTypes.bool,
};

RecursiveList.defaultProps = {
  isRoot: false,
  isRootChild: false,
  isArray: false,
  isIndexZero: false,
};

export default RecursiveList;
