import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    name: yup.string().required().max(10),
  })
  .required();

function useCreateWorkspace(handleCreateWorkspace) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit({ name: workspaceName }) {
    handleCreateWorkspace({ workspaceName });
    reset();
    handleClose();
  }

  return { dialogIsOpen, setDialogIsOpen, handleClose, handleSubmit, control, errors, onSubmit };
}

export { useCreateWorkspace };
