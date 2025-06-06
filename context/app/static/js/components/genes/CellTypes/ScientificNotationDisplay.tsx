import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import React from 'react';

export default function ScientificNotationDisplay({ value }: { value: number }) {
  if (value === 0) {
    return <span>0</span>;
  }

  const scientificNotationValue = value.toExponential(2);

  const [base, power] = scientificNotationValue.split('e');
  const formattedBase = parseFloat(base).toFixed(2);
  const formattedPower = parseInt(power, 10);

  return (
    <SecondaryBackgroundTooltip title={value}>
      <span>
        {formattedBase} &times; 10<sup>{formattedPower}</sup>
      </span>
    </SecondaryBackgroundTooltip>
  );
}
