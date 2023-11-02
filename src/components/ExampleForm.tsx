import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
type FormInputSchema = {
  name?: string;
};

type FormOutputSchema = {
  name: string;
};

const formInputValidator = z.object({
  name: z.string(),
});

export const Form: React.FC = () => {
  const form = useForm<FormInputSchema, unknown, FormOutputSchema>({
    resolver: zodResolver(formInputValidator),
  });

  const onSubmit: SubmitHandler<FormInputSchema> = (a, event) => {
    //
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}></form>;
};
