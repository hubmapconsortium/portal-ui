import React from 'react';
import { ESEntityType } from 'js/components/types';
import LineUpComponent from './LineUpComponent';
import { SectionHeader } from '../Home/style';
import { capitalize } from '@mui/material/utils';

interface LineUpPageProps {
  uuids?: string[];
  entityType?: ESEntityType;
}

function LineUpPage(props: LineUpPageProps) {
  return (
    <>
      <SectionHeader variant="h1" component="h1">
        LineUp {props.entityType ? `${capitalize(props.entityType)}s` : ''}
      </SectionHeader>
      <LineUpComponent {...props} />
    </>
  );
}

export default LineUpPage;
