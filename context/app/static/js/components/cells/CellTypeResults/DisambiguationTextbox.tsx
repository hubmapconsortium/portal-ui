import React from 'react';
import { useAllCellTypeNames } from './hooks';

interface DisambiguationTextboxProps {
  cellName: string;
}

export function DisambiguationTextbox({ cellName }: DisambiguationTextboxProps) {
  const { cellTypeNames, error } = useAllCellTypeNames(cellName);

  if (error) {
    return <div>Error loading cell type names</div>;
  }

  if (!cellTypeNames || cellTypeNames.length < 2) {
    return null;
  }

  return (
    <div>
      <p>The selected cell type ({cellName}) corresponds to the following terms in Azimuth annotations:</p>
      <ul>
        {cellTypeNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
