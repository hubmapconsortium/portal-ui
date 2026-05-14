import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MolecularDataQueryFormProps, MolecularDataQueryFormState } from './types';
import { ResultsProvider } from './ResultsProvider';
import { isScFindMethod } from './hooks';

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
    // Determine the default query method for the new query type,
    // preserving the current scFind modality (e.g. scFindATAC) when switching between gene and cell-type
    const defaultMethodForType = {
      gene: 'scFind',
      protein: 'crossModality',
      'cell-type': 'scFind',
    }[queryType] as MolecularDataQueryFormState['queryMethod'];

    // Read current queryMethod imperatively to avoid adding it to the effect deps
    const currentQueryMethod = methods.getValues('queryMethod');

    // If the current method is an scFind method and the new query type also supports scFind,
    // keep the current method to preserve the modality selection (e.g. scFindATAC)
    const newQueryMethod =
      isScFindMethod(currentQueryMethod) && queryType !== 'protein' ? currentQueryMethod : defaultMethodForType;

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
  }, [queryType, reset, initialValues, methods]);

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
