import { useLocalForm } from "@/hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { z } from "zod";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm: React.FC<{
  onSubmit: (values: LoginFormValues) => unknown;
  isLoading?: boolean;
}> = ({ onSubmit, isLoading = false }) => {
  const form = useLocalForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <TextInput
        mt={24}
        placeholder="john@email.com..."
        label="Email"
        withAsterisk
        {...form.register("email")}
      />

      <PasswordInput
        mt={12}
        placeholder="..."
        label="Password"
        withAsterisk
        {...form.register("password")}
      />

      <Button
        mt={12}
        w={"100%"}
        loading={isLoading}
        type="submit"
        data-cy="login-button"
      >
        Login
      </Button>
    </form>
  );
};
