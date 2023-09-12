import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().max(150),
  })
  .required();

function useCreateWorkspace({ handleCreateWorkspace, defaultName }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '' || defaultName,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
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
