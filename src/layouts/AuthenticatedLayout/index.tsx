import { AppShell, Center, Text } from "@mantine/core";
import { useState, type ReactElement } from "react";
import { Header } from "./_Header";
import { Navbar } from "./_Navbar";

export const AuthenticatedLayout: React.FC<ReactElement> = (page) => {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      navbar={{
        width: 256 - 32,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 51 }}
    >
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Header>
        <Header
          onMenuToggle={() => setOpened((prev) => !prev)}
          opened={opened}
        />
      </AppShell.Header>

      <AppShell.Footer>
        <Center h={"100%"}>
          <Text size={"sm"} color="gray">
            © 2023 Vultra Digital Asia
          </Text>
        </Center>
      </AppShell.Footer>

      <AppShell.Main>{page}</AppShell.Main>
    </AppShell>
  );
};
