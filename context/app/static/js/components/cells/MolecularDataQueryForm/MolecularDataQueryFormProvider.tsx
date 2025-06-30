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
  const threshold = watch('minimumCellPercentage');
  const genes = watch('genes');
  const proteins = watch('proteins');
  const cellTypes = watch('cellTypes');

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

  useEffect(() => {
    // Reset the form submission state when any query fields change
    // This is to ensure that updating the parameters while the form is submitted
    // does not immediately trigger a re-query for results
    // Per the react-hook-form docs, it's recommended to do this reset
    // in useEffect as execution order matters

    // TODO: With this approach, the query still reruns and gets discarded after the first change since the
    // form state is reset AFTER the swr hook gets new params. We should investigate if there is a way to
    // prevent the query from running until the form is submitted again. Maybe switch to a mutation?
    reset(undefined, {
      keepIsSubmitted: false,
      keepIsSubmitSuccessful: false,
      keepValues: true,
      keepDirty: false,
    });
  }, [threshold, genes, proteins, cellTypes, reset]);

  return (
    <FormProvider {...methods}>
      <ResultsProvider>{children}</ResultsProvider>
    </FormProvider>
  );
}
