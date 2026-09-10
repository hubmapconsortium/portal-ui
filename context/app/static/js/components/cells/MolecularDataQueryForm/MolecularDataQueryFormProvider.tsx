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
      ...initialValues,
    } as Partial<MolecularDataQueryFormState>,
  });

  const { watch, reset } = methods;

  // eslint-disable-next-line react-hooks/incompatible-library -- External library hook signature (Tanstack Virtual / react-hook-form).
  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');

  // Reset selected options when query type changes
  useEffect(() => {
    // Gene and cell type both support every query method, so the current method
    // carries over to preserve the modality selection (e.g. scFindATAC).
    // Read it imperatively to avoid adding it to the effect deps.
    const currentQueryMethod = methods.getValues('queryMethod');

    reset(
      {
        genes: [],
        cellTypes: [],
        ...initialValues,
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryType,
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryMethod: currentQueryMethod,
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
