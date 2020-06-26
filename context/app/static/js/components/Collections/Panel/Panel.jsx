/* eslint-disable react/no-array-index-key */
import React from 'react';
import { StyledPaper, InlineDataKey, DataKey, StyledDiv, StyledTypography } from './style';

function StringEntry(props) {
  const { objectKey, objectValue, ml } = props;
  return (
    <StyledTypography ml={ml} variant="body1">
      <InlineDataKey>{objectKey}: </InlineDataKey> {objectValue}
    </StyledTypography>
  );
}

function ArrayOfStrings(props) {
  const { objectKey, objectValue } = props;
  return (
    <div>
      <DataKey variant="body1">{objectKey}: </DataKey>
      {objectValue.map((v) => (
        <StyledTypography key={v} variant="body1" ml={1}>
          {v}
        </StyledTypography>
      ))}
    </div>
  );
}

function ArrayOfObjects(props) {
  const { objectKey, objectValue } = props;
  return (
    <StyledDiv>
      <DataKey variant="body1">{objectKey}: </DataKey>
      {objectValue.map((v, i) => (
        <RecursiveList key={`${objectKey}-${i}`} data={v} ml={1} />
      ))}
    </StyledDiv>
  );
}

function BooleanEntry(props) {
  const { objectKey, objectValue, ml } = props;
  const stringObjectValue = objectValue === true ? 'true' : 'false';
  return (
    <StyledTypography ml={ml} variant="body1">
      <InlineDataKey>{objectKey}: </InlineDataKey> {stringObjectValue}
    </StyledTypography>
  );
}

function NonStringEntry(props) {
  const { objectKey, objectValue: rawValue } = props;
  const objectValue = objectKey === 'creators' ? JSON.parse(rawValue) : rawValue;

  if (typeof objectValue === 'boolean') {
    return <BooleanEntry objectKey={objectKey} objectValue={objectValue} />;
  }
  if (objectValue.constructor.name === 'Array' && typeof objectValue[0] === 'string') {
    return <ArrayOfStrings objectKey={objectKey} objectValue={objectValue} />;
  }
  if (objectValue.constructor.name === 'Array' && objectValue[0].constructor.name === 'Object') {
    return <ArrayOfObjects objectKey={objectKey} objectValue={objectValue} />;
  }
  console.warn(`${objectKey} not handled!`);
  return <div>{objectKey} not handled!</div>;
}

function RecursiveList(props) {
  const { data, ml } = props;
  return (
    <StyledDiv>
      {Object.entries(data).map(([k, v]) =>
        typeof v === 'string' && k !== 'creators' ? (
          <StringEntry key={k} objectKey={k} objectValue={v} ml={ml} />
        ) : (
          <NonStringEntry key={k} objectKey={k} objectValue={v} />
        ),
      )}
    </StyledDiv>
  );
}

function Card(props) {
  const { data } = props;
  return (
    <StyledPaper>
      <RecursiveList data={data} />
    </StyledPaper>
  );
}

export default Card;
