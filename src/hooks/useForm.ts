import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormRegister,
  type UseFormReturn,
} from "react-hook-form";

export function useLocalForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined
>(
  props?: UseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext, TTransformedValues> {
  const useRhfForm = useForm(props);

  const register: UseFormRegister<TFieldValues> = (value) => {
    return {
      ...useRhfForm.register(value),
    };
  };
  return {
    ...useRhfForm,
    register: register,
  };
}
