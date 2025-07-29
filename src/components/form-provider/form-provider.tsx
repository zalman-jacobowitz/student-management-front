import { useForm } from "react-hook-form";

import { Form } from "src/components/hook-form";

interface FormProviderProps {
  children: React.ReactNode;
  handleFilters: (data: any) => void;
}

export function FormProvider({
  children,
  handleFilters=()=>{}
}: FormProviderProps){

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = handleSubmit((data) => {
    handleFilters(data);
  })

  return (
  <Form methods={methods} onSubmit={onSubmit}>
    {children}
  </Form>
  )
}