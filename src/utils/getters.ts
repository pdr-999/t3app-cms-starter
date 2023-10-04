import { notifications } from "@mantine/notifications";

export const getErrorNotification = (err: unknown) => {
  let title = "";
  let message = undefined;

  if (err instanceof Error) {
    title = err.message;

    if (err.cause instanceof Error) {
      message = err.cause.message;
    }
  }

  if (typeof err === "string") {
    title = err;
  }

  // Find some way to get zodError, for now make sure FE can't trigger it

  if (!title) return;
  notifications.show({
    title,
    message,
    color: "red",
  });
};
