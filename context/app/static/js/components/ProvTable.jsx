import React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import ProvTypesList from './ProvTypesList';

const FlexContainer = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content:space-around;
`;

export default function ProvTable(props) {
  const { provData, typesToSplit } = props;

  const types = Object.values(provData.entity).reduce((acc, item) => {
    acc[typesToSplit.indexOf(item['prov:type'])].push(item);
    return acc;
  }, [[], [], []]).filter((arr) => arr.length > 0);

  return (
    <FlexContainer>
      {types.map((type, i) => (
        type && type.length
          ? (
            <React.Fragment key={`provenance-list-${typesToSplit[i].toLowerCase()}`}>
              <ProvTypesList data={type} />{
                // eslint-disable-next-line react/no-array-index-key
                i < (types.length - 1) && <Divider key={`provenance-table-divider-${i}`} orientation="vertical" flexItem />
                }
            </React.Fragment>
          )
          : (null)))}
    </FlexContainer>
  );
}
