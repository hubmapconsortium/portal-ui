import React, { PropsWithChildren, useEffect } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { useEventCallback } from '@mui/material';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { MolecularDataQueryFormState } from './types';

interface MolecularDataQueryFormProps extends PropsWithChildren {
  initialValues?: Partial<MolecularDataQueryFormState>;
  onSubmit: (data: MolecularDataQueryFormState) => void;
}

export default function MolecularDataQueryForm({ children, onSubmit, initialValues }: MolecularDataQueryFormProps) {
  const methods = useForm<MolecularDataQueryFormState>({
    defaultValues: {
      step: 'queryType',
      queryType: 'gene',
      genes: [],
      ...initialValues,
    },
  });
  const { toastError } = useSnackbarActions();
  const onError = useEventCallback((errors: FieldErrors<MolecularDataQueryFormState>) => {
    const error = Object.values(errors)
      .map((field) => field.message)
      .join(' ');
    toastError(error);
  });

  const queryType = methods.watch('queryType');
  const { setValue } = methods;

  // Reset selected options when query type changes
  useEffect(() => {
    setValue('genes', []);
    setValue('proteins', []);
    setValue('cellTypes', []);
  }, [queryType, setValue]);

  const handleSubmit: React.FormEventHandler = useEventCallback((event) => {
    event.preventDefault();
    methods.handleSubmit(onSubmit, onError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormProvider>
  );
}
