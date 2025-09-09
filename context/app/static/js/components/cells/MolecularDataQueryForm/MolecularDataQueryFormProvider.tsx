import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MolecularDataQueryFormProps, MolecularDataQueryFormState } from './types';
import { ResultsProvider } from './ResultsProvider';

export default function MolecularDataQueryFormProvider({ children, initialValues }: MolecularDataQueryFormProps) {
  const methods = useForm<MolecularDataQueryFormState>({
    defaultValues: {
      queryType: 'gene',
      queryMethod: 'scFind',
      genes: [],
      minimumCellPercentage: 5,
      minimumExpressionLevel: 1,
      ...initialValues,
    } as Partial<MolecularDataQueryFormState>,
  });

  const { watch, reset } = methods;

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');

  // Reset selected options when query type changes
  useEffect(() => {
    const newQueryMethod = {
      gene: 'scFind',
      protein: 'crossModality',
      'cell-type': 'scFind',
    }[queryType] as MolecularDataQueryFormState['queryMethod'];

    reset(
      {
        genes: [],
        proteins: [],
        cellTypes: [],
        ...initialValues,
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryType,
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryMethod: newQueryMethod,
      },
      {
        keepDirty: false,
        keepIsSubmitSuccessful: false,
        keepIsSubmitted: false,
      },
    );
  }, [queryType, reset, initialValues]);

  // Reset submission state when query method changes
  useEffect(() => {
    reset(undefined, {
      keepValues: true,
      keepDirty: false,
      keepIsSubmitSuccessful: false,
      keepIsSubmitted: false,
    });
  }, [queryMethod, reset]);

  return (
    <FormProvider {...methods}>
      <ResultsProvider>{children}</ResultsProvider>
    </FormProvider>
  );
}
